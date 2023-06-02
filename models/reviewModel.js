const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = mongoose.Schema({
    review:{
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: [1, 'Rating cannot be less than 1'],
        max: [5, 'Rating cannot be greater than 5']
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.statics.calcAverageRating = async function(tourId){
     const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);
    if(stats.length > 0){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    }
    else{
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
}
// reviewSchema.pre(/^find/, function(next){
//     this.populate({
//         path: 'tour',
//         select:'name'
//     });
//     this.populate({
//         path: 'user',
//         select: 'name photo'
//     });
//     next();
// })

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

reviewSchema.pre(/^findOne/, async function(next){
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOne/, async function(){
    await this.r.constructor.calcAverageRating(this.r.tour);
})

reviewSchema.post('save', function(){
     this.constructor.calcAverageRating(this.tour);  //Review.calcAverageRating(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
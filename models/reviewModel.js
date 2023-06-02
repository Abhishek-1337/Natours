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

reviewSchema.pre(/^find/, function(next){
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
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
};
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

reviewSchema.post('save', function(){
    this.constructor.calcAverageRating(this.tour);  //Review.calcAverageRating(this.tour);
});

//pre hook is used to access the document that is being updated or deleted as we cant access in post .
reviewSchema.pre(/^findOneAnd/, async function(next){
    this.r = await this.model.findOne({ _id: this._conditions._id });
    next();
});

//we used the post as we can't use findOne in here, it is query middleware and we dont have access to the document
reviewSchema.post(/^findOneAnd/, function(){
    this.model.calcAverageRating(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
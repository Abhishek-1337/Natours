const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'missing name value'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have characters less than or equal to 40'],
        minlength: [40, 'A tour name must have characters greater or equal to 10'],
    },
    slug: String, 
    duration:{
        type: Number,
        required: [true, 'A tour must have duration'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: "diffculty should be easy, medium or difficult"
        }
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have group size']
    },
    ratingsAverage:{
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 0'],
        max: [5, 'Rating must be below 6']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'missing price value']
    },
    priceDiscount: {
        type: Number,
        validate: {                     //Custom validator
            validator: function(val){
                return val < this.price;
            },
            message: "Discount price {{VALUE}} should be lower than regular price"
        }
    },
    summary:{
        type: String,
        trim: true,
        required: [true, 'A tour must have summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have image cover']
    },
    images:[String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select:false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(
    function(){
            return this.duration / 7;
    }
);

//Document middleware pre and post hooks can be used after or before save and create event
//creating slug for tour name
tourSchema.pre("save", function(next){
    this.slug = slugify(this.name, {
        lower: true
    });
    next();      
});

// tourSchema.post('save', function(docs, next){
//     console.log(docs);
//     next(); 
// })

//QUERY middle: execute functions after or before certain query executes like: find or findOne
tourSchema.pre(/^find/, function(next){
    this.find({secretTour: { $ne: true }});
    this.start = Date.now();
    next();
});

// tourSchema.post(/^find/, function(docs, next){
//     console.log(`Query took ${Date.now()-this.start} ms`);
//     next();
// });


//Aggregate query- executes before and after every aggregation
tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({
        $match: {
            secretTour: { $ne : true }
        }
    });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
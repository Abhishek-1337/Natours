const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'missing name value'],
        unique: true,
        trim: true
    },
    duration:{
        type: Number,
        required: [true, 'A tour must have duration']
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
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    priceDiscount: Number,
    price: {
        type: Number,
        required: [true, 'missing price value']
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
    startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
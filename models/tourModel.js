const mongoose = require('mongoose');

const tourSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'missing name value'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'missing price value']
    }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
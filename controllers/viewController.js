const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync( async(req, res)=>{
    //Get all the tours from the database
    const tours = await Tour.find();

    //then create a template 
    //pass tours to template
    res.status(200).render('overview', {
        title: "All tours",
        tours
    });
});

exports.getTour = catchAsync(async (req, res)=>{
    //Get the requested tour with (reviews and guides)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'rating review users'
    });
    console.log(tour);
    res.status(200).render('tour', {
        title: "The Forest Hiker tour",
        tour
    });
});
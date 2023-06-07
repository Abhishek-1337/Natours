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

exports.getTour = (req, res)=>{
    res.status(200).render('tour', {
        title: "The Forest Hiker tour"
    });
};
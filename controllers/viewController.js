const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync( async(req, res, next)=>{
    //Get all the tours from the database
    const tours = await Tour.find();

    //then create a template 
    //pass tours to template
    res.status(200).render('overview', {
        title: "All tours",
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next)=>{
    //Get the requested tour with (reviews and guides)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'rating review users'
    });

    if(!tour){
        return next(new AppError('There is no tour with that name', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} tour`,
        tour
    });
});

exports.getLoginForm = (req, res)=>{
    res.status(200).render('login',{
        title: 'login to your account'
    });
}
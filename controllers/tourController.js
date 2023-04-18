const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res)=>{
    try{
        const queryObj = {...req.query};
        const excludedEl = ['page', 'limit', 'sort', 'fields'];
        excludedEl.forEach((el)=> delete queryObj[el]);
        
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);
        let query = Tour.find(JSON.parse(queryStr));
        

        //sorting based on query
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        else{
            query = query.sort('-createdAt');
        }

        //selecting the fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        else{
            query = query.select('-__v');
        }

        //pagination of the API
        const page = req.query.page*1 || 1;
        const limit = req.query.limit*1 || 1;
        const skip = (page-1)*limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error("This page doesn't exist");
        }
            const tours = await query;
            res.status(200).json({
                status: "success",
                results: tours.length,
                data:{
                    tours
                }
            })
    }
    catch(err){
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
}

exports.createTour = async (req, res) => {
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    }
    catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    }catch(err){
        res.status(404).json({
            status: "fail",
            message: err
        });
    }
};

exports.updateTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
    }
    catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
};

exports.deleteTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            data:{
                tour
            }
        });
    }
    catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        })
    }
};
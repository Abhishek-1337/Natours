const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const docs = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!docs){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            data: docs
        }
    });
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const docs = await Model.findByIdAndDelete(req.params.id);

    if(!docs){
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: "success",
        data:{
            data:docs
        }
    });

});

const User = require('../models/userModel');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require('../controllers/handlerFactory');

const filteredObj = (body, ...allowedFields) => {
    let newObj = {};
    Object.keys(body).forEach((item)=>{
        if(allowedFields.includes(item)){
            newObj[item] = body[item];
        }
    });
    return newObj;
}

exports.getAllUsers = factory.getAll(User);

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) =>{
    if(req.password || req.passwordConfirm){
        return next(new AppError('This route is not used to update password, try /updatePassword', 400));
    }

    const filteredBody = filteredObj(req.body, 'name', 'email');
    const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: "success",
        data:{
            user
        }
    })
});

exports.deleteMe = catchAsync( async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});
    res.status(200).json({
        status: "success"
    });
})

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
    res.status(400).json({
        status: "failed",
        message: "Route is not defined. User ./signup"
    })
};

//Do not update password using this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

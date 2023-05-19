const User = require('../models/userModel');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filteredObj = (body, ...allowedFields) => {
    let newObj = {};
    Object.keys(body).forEach((item)=>{
        if(allowedFields.includes(item)){
            newObj[item] = body[item];
        }
    });
    return newObj;
}

exports.getAllUsers = catchAsync( async(req, res, next) => {
    const users = await User.find();
    res.status(500).json({
        status: "success",
        data:{
            users
        }
    })
})

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

exports.createUsers = (req, res) => {
    res.status(500).json({
        status: "failed",
        message: "Route is not defined"
    })
};

exports.getUser = (req, res) => {
    res.status(500).json({
        status: "failed",
        message: "Route is not defined"
    })
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: "failed",
        message: "Route is not defined"
    })
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "failed",
        message: "Route is not defined"
    })
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "failed",
        message: "Route is not defined"
    })
};
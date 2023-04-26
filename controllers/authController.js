const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const jwtSign = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    //on sign up log the user in meaning send them the token
    const token = jwtSign(newUser._id);
    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    });
});

//login using email and password
exports.login = catchAsync(async (req, res, next)=>{
    const { email, password } = req.body;

    //1.Check if email and password 
    if(!email || !password){
        return next(new AppError('Please provide email and password', 400));
    }

    //2. if user exist and password is correct
    const user = await User.findOne({ email }).select('+password');  //password is explicitly selected by devs
    if(!user || !(await user.checkPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401));
    }

    //3.if everything ok send user a token
    const token = jwtSign(user._id);
    res.status(200).json({
        status: "success",
        token
    });
});
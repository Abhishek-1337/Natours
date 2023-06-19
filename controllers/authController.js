const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const Email = require('../utils/email');
const crypto = require('crypto');

const jwtSign = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};


const createSendToken = (user, statusCode, res) => {
    const token = jwtSign(user._id);
    let cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    user.password = undefined;
    //attaching cookies to the response
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        token,
        data:{
            user: user
        }
    });
}

exports.signup = catchAsync(async(req, res, next) => {
    console.log("hello"+req.body);

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    //sending welcome email
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();

    //on sign up log the user in meaning send them the token
    createSendToken(newUser, 201, res);

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
    createSendToken(user, 200, res);
});

exports.logOut = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expire: new Date(Date.now() + 10*1000),
        httpOnly: true
    });

    res.status(200).json({status: "success"});
};

exports.protect = catchAsync(async(req, res, next) => {
    //Check if token's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }

    if(!token){
        return next(new AppError('You are not logged in. Please login to get access', 401));
    }
    //Verify token if anybody has altered it or not
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //Check if user still exist
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('User not found', 401));
    }
    
    //Check if user changes password after getting a token
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password', 401));
    }

    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

//To render different features using the login state
exports.isLoggedIn = async(req, res, next) => {
    //Check if token's there
    let token;
    try{
        if(req.cookies.jwt){
            //Verify token if anybody has altered it or not
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);    
        
            //Check if user still exist
            const currentUser = await User.findById(decoded.id);
            if(!currentUser){
                return next();
            }
            console.log(decoded);
            //Check if user changes password after getting a token
            if(currentUser.changedPasswordAfter(decoded.iat)){
                return next();
            }
        
            //GRANT ACCESS TO PROTECTED ROUTE
            res.locals.user = currentUser;
            return next();
        }
    }
    catch(err){
        return next();
    }

    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new AppError('You don\'t have permission to perform this action', 403)
            );
        }
        next();
    }
};

exports.forgotPassword = catchAsync(async(req, res, next) => {
    //1. Get user based on email
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(
            new AppError('No user found with this email', 404)
        );
    }

    //2. Generate token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //Send reset toke to user's email address
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    try{
        await new Email(user, resetURL).sendResetToken();
    
        res.status(200).json({
            status: "success",
            message: "token sent to email",
        });
    }
    catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError('Email could not be sent', 400)
        );
    }
});

exports.resetPassword = catchAsync( async(req, res, next)=> {
    //Get user based on token
    const resetToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({   
        passwordResetToken: resetToken,
        passwordResetExpires: { $gt: Date.now() } 
    });

    if(!user){
        return next(
            new AppError('Token is invalid or expired', 400)
        );
    }

    //if token hasn't expired and there is user set new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    //update changePasswordAt property for that user
    await user.save();
    
    //log user in and send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync( async(req, res, next)=>{
    //Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    //check if given password is correct
    if(!await user.checkPassword(req.body.passwordCurrent || req.body.data.passwordCurrent, user.password)){
        return next(
            new AppError('Your current password is wrong', 401)
        );
    }

    //update password
    user.password = req.body.password || req.body.data.password;
    user.passwordConfirm =req.body.password || req.body.data.passwordConfirm;
    await user.save();

    //log in and send token
    createSendToken(user, 200, res);
});
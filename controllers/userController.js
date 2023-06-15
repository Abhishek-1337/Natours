const User = require('../models/userModel');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require('../controllers/handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         console.log(file);
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         const extn = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${extn}`);
//     }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }
    else{
        cb(new AppError('Not an image. Please upload only image!', 400), false)
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.updateUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();            
    //since multer filename is not applied now, we have to redefine it now.
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/users/${req.file.filename}`);

    next();
}

const filteredObj = (body, ...allowedFields) => {
    let newObj = {};
    for (let key in body) {
        if (body[key] === "name" || body[key] === "email") {
            newObj[key] = body[key];
        }
      }
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
    if(req.file){
      filteredBody.photo = req.file.filename;  
    }
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

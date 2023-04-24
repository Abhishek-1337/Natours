const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
    const val = err.keyValue.name;
    const message = `Duplicate field value : ${val}. Please use another value!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(val=>{
        return Object.values(val)[0].message;
    })
    const message = `Invalid input data :  ${errors.join('. ')}`;  //
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    //Operational: trusted error send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else{     //Programming or other wrong don't leak other details
        //Log error
        // console.log('Error ' + err);
        //Send generic message  
        res.status(500).json({
            status: err.status,
            message: 'Something went wrong',
        });
    }
}

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development') sendErrorDev(err, res);
    else {
        let error = { ...err };
        if(err.name === 'CastError') error = handleCastErrorDB(error); 
        if(err.code === 11000) error = handleDuplicateFieldsDB(error);
        if(err.name === 'ValidationError') error = handleValidationErrorDB(error);
        sendErrorProd(error, res);
    }
};
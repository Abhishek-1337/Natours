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
        console.log('Error ' + err);
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
    else if(process.env.NODE_ENV === 'production') sendErrorProd(err, res);
};
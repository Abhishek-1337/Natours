const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//Add security headers
app.use(helmet());

//Sanitization nosql injections
app.use(mongoSanitize());

//Sanitize xss injections
app.use(xss());

//prevent parameter pollution
app.use(hpp());

//limit the requests from user
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'To many requests from this IP, please try again in one hour'
})
app.use('/api', limiter);

//body parser, Reading data from body into req.body
app.use(express.json());

//serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    next();
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next)=>{
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.statusCode = 404;
    // err.status = 'fail';
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
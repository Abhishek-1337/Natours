const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

process.on('uncaughtException', err=>{
    console.log('Uncaught exception, shutting down..');
    console.log(err.name, err.message);
    process.exit(1);
});

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser: true,
    
})
.then(()=>console.log('DB connection successful'));

const server = app.listen(3000, (req, res)=>{
    console.log('Listening on port 3000');
});

process.on('unhandledRejection', err=>{
    console.log('Unhandled rejection...shutting down server...');
    console.log(err);
    server.close(()=>{
        process.exit(1);   //1 is for uncaught errors, exceptions
    })
});



const fs = require('fs');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config({path: './config.env'});

const mongoose = require('mongoose');

const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser: true,
    
})
.then(()=>console.log('DB connection successful'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

//Import the data here.
const importData = async() => {
    try{
        await Tour.create(tours);
        await Review.create(reviews);
        await User.create(users, { validateBeforeSave: false });
        console.log('DATA IMPORTED');
    }
    catch(err){
        console.log(err);
    }
    process.exit();
}

//delete data from a collection
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('DATA deleted');
    }
    catch(err){
        console.log('error in deletion from the collection');
    }
    process.exit();
}

//using argument for calling diff function
if(process.argv[2] === '--import'){
    importData();
}
else if(process.argv[2] === '--delete'){
    deleteData();
}



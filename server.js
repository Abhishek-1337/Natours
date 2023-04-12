const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const mongoose = require('mongoose');

const app = require('./app');

const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);
console.log(DB);
mongoose.connect(DB,{
    useNewUrlParser: true,
    
})
.then(()=>console.log('DB connection successful'));

app.listen(3000, (req, res)=>{
    console.log('Listening on port 3000');
})
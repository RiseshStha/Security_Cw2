const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./database/databse");
const cors = require("cors");
const fileUpload =  require('express-fileupload')

const app = express();

//json config
app.use(express.json());

app.use(fileUpload())

app.use(express.static('./public'))

const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

dotenv.config();//env file configuring

//connecting database
connectDB();

const PORT = process.env.PORT; //Defining port

app.listen(PORT, () =>{
    console.log("Server is running");
    console.log(`Server is running on port ${PORT}`)
});

//creating endpoints
app.get('/test', (req, res)=>{ // reqeust and send response (endpoint)
    res.send('Test Api is Working!...')
})
//endpoints
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/product', require('./routes/productRoutes'));
app.use('/api/comment', require('./routes/commentRoutes'));
app.use('api/message', require('./routes/messageRoutes'));


module.exports = app;



// const dotenv = require("dotenv");
// const express = require("express");
// const mongoose = require("mongoose");
// const connectDB = require("./database/databse");
// const cors = require("cors");
// const fileUpload =  require('express-fileupload')
// const xss = require('xss-clean');
// const mongoSanitize = require('express-mongo-sanitize');
// const logger = require('./service/logger');


// const app = express();

// //json config
// app.use(express.json());

// app.use(fileUpload())

// app.use(express.static('./public'))

// //preventing Xss
// app.use(xss());

// // To sanitize data from NoSQL injection
// app.use(mongoSanitize());


// const corsOptions = {
//     origin: true,
//     credentials: true,
//     optionSuccessStatus: 200,
// }

// app.use(cors(corsOptions));

// dotenv.config();//env file configuring

// //connecting database
// connectDB();

// const PORT = process.env.PORT; //Defining port

// app.listen(PORT, () =>{
//     console.log("Server is running");
//     console.log(`Server is running on port ${PORT}`)
// });

// //creating endpoints
// app.get('/test', (req, res)=>{ // reqeust and send response (endpoint)
//     res.send('Test Api is Working!...')
// })
// //endpoints
// app.use('/api/user', require('./routes/userRoutes'));
// app.use('/api/product', require('./routes/productRoutes'));
// app.use('/api/comment', require('./routes/commentRoutes'));
// app.use('api/message', require('./routes/messageRoutes'));


// module.exports = app;


const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./database/databse");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('./service/logger'); // Import logger
const morgan = require('morgan');

const app = express();

// Load environment variables
dotenv.config();

// JSON parsing middleware
app.use(express.json());

// File upload middleware
app.use(fileUpload());

// Serving static files
app.use(express.static('./public'));

// Preventing XSS attacks
app.use(xss());

// To sanitize data from NoSQL injection
app.use(mongoSanitize());

// CORS configuration
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Log HTTP requests using Morgan and Winston
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim()) // Log HTTP requests
    }
}));

// Log server start
logger.info("Starting the server...");

// Connecting database
connectDB()
    .then(() => logger.info("Connected to MongoDB successfully"))
    .catch((error) => logger.error(`Database connection error: ${error.message}`));

// Define server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

// Creating test endpoint
app.get('/test', (req, res) => {
    logger.info('Test endpoint accessed');
    res.send('Test API is Working!...');
});

// API endpoints with logging
app.use('/api/user', (req, res, next) => { logger.info("User route accessed"); next(); }, require('./routes/userRoutes'));
app.use('/api/product', (req, res, next) => { logger.info("Product route accessed"); next(); }, require('./routes/productRoutes'));
app.use('/api/comment', (req, res, next) => { logger.info("Comment route accessed"); next(); }, require('./routes/commentRoutes'));
app.use('/api/message', (req, res, next) => { logger.info("Message route accessed"); next(); }, require('./routes/messageRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;

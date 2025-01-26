const dotenv = require("dotenv");
const express = require("express");
const https = require('https');
const fs = require('fs');
const mongoose = require("mongoose");
const connectDB = require("./database/databse");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('./service/logger');
const morgan = require('morgan');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

// Load environment variables
dotenv.config();

// Middleware setup remains the same
app.use(express.json());
app.use(fileUpload());
app.use(express.static('./public'));
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// Updated CORS for HTTPS
const corsOptions = {
    origin: 'https://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// SSL Configuration
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
};

// Rest of your middleware and routes remain the same
const csrfProtection = csrf({ cookie: true });
app.use(express.urlencoded({extended: false}));
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Database connection
connectDB()
    .then(() => logger.info("Connected to MongoDB successfully"))
    .catch((error) => logger.error(`Database connection error: ${error.message}`));

// Routes
app.get('/csrf', csrfProtection,(req, res) => {
    logger.info('Csrf endpoint accessed');
    res.cookie('csrfToken', req.csrfToken(), { 
        httpOnly: true, 
        secure: true,
        sameSite: 'strict' 
    });
    res.json({
        message: 'csrf API is Working!',
        csrfToken: req.csrfToken()
    })
});

// Your routes
app.use('/api/user', csrfProtection, (req, res, next) => { logger.info("User route accessed"); next(); }, require('./routes/userRoutes'));
app.use('/api/product', (req, res, next) => { logger.info("Product route accessed"); next(); }, require('./routes/productRoutes'));
app.use('/api/comment', (req, res, next) => { logger.info("Comment route accessed"); next(); }, require('./routes/commentRoutes'));
app.use('/api/message', (req, res, next) => { logger.info("Message route accessed"); next(); }, require('./routes/messageRoutes'));

// Error handling
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(options, app).listen(PORT, () => {
    logger.info(`HTTPS Server is running on port ${PORT}`);
});

module.exports = app;
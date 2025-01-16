const {model} = require('mongoose');
const mongoose = require('mongoose');

//Making Schema

const productSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        maxlength: 300,
    },
    category: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    negotation: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    delivery: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    //IMAGE
    productImage: {
        type: String,
        required: true,
    },
    createdAt : {
        type: Date,
        default : Date.now,
    },
    createdBy : {
        type: String,
        required: true,
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    }
});

const Product = mongoose.model('products', productSchema);

module.exports = Product

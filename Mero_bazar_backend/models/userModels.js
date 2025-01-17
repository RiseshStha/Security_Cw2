const {model} = require('mongoose');

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        uinque: true,
    },
    address: {
        type: String,
        default :'Nepal'
    },
    password: {
        type: String,
        required: true,
    },
    otpReset : {
        type : Number,
        default : null,
    },
    otpResetExprires : {
        type : Date,
        default : null,
    },
    profileImage: {
        type: String,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
});


const User = mongoose.model('user', userSchema);

module.exports = User;
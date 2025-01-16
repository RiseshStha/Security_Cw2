const userModel = require('../models/userModels');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendOtp');
const path = require('path');
const fs = require('fs');
const commentModels = require("../models/commentModels");
const axios = require('axios')


const PASSWORD_HISTORY_LIMIT = 5; // Number of previous passwords to remember
const PASSWORD_EXPIRY_DAYS = 90; // Password expires after 90 days

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; 

async function isPasswordReused(user, newPassword) {
    // Check against current password first
    const isCurrentPassword = await bcrypt.compare(newPassword, user.password);
    if (isCurrentPassword) {
        return true;
    }

    // Check against password history
    if (user.passwordHistory && user.passwordHistory.length > 0) {
        for (const historicalPassword of user.passwordHistory) {
            const isMatch = await bcrypt.compare(newPassword, historicalPassword.hash);
            if (isMatch) {
                return true;
            }
        }
    }
    return false;
}

// Helper function to update password history
async function updatePasswordHistory(user, newPasswordHash) {
    if (!user.passwordHistory) {
        user.passwordHistory = [];
    }

    // Add current password to history before updating
    if (user.password) {
        user.passwordHistory.unshift({
            hash: user.password,
            createdAt: user.passwordLastChanged || new Date()
        });
    }

    // Limit the history size
    user.passwordHistory = user.passwordHistory.slice(0, PASSWORD_HISTORY_LIMIT - 1);
    
    // Update current password and timestamp
    user.password = newPasswordHash;
    user.passwordLastChanged = new Date();
}

// Helper function to check if password has expired
function isPasswordExpired(passwordLastChanged) {
    if (!passwordLastChanged) return true;
    
    const expiryDate = new Date(passwordLastChanged.getTime() + (PASSWORD_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
    return new Date() > expiryDate;
}

// Enhanced createUser with CAPTCHA
const createUser = async (req, res) => {
    const { fullName, phoneNumber, password, captchaToken } = req.body;

    // Validate required fields
    if (!fullName || !phoneNumber || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields including CAPTCHA"
        });
    }
    if ( !captchaToken) {
        return res.status(400).json({
            success: false,
            message: "Please fill the CAPTCHA"
        });
    }

    try {
        // Verify CAPTCHA
        // const isCaptchaValid = await verifyCaptchaToken(captchaToken);
        // if (!isCaptchaValid) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "CAPTCHA verification failed"
        //     });
        // }

        // Check for existing user
        const existingUser = await userModel.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const randomSalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, randomSalt);

        // Create new user
        const newUser = new userModel({
            fullName,
            phoneNumber,
            password: hashPassword,
            passwordLastChanged: new Date(),
            passwordHistory: []
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User created successfully"
        });

    } catch (error) {
        console.error('User creation error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Enhanced loginUser with CAPTCHA
const loginUser = async (req, res) => {
    const { phoneNumber, password, captchaToken } = req.body;

    // Validate required fields
    if (!phoneNumber || !password || !captchaToken) {
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields including CAPTCHA"
        });
    }
    if ( !captchaToken) {
        return res.status(400).json({
            success: false,
            message: "Please fill the CAPTCHA"
        });
    }

    try {
        // // Verify CAPTCHA
        // const isCaptchaValid = await verifyCaptchaToken(captchaToken);
        // if (!isCaptchaValid) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "CAPTCHA verification failed"
        //     });
        // }

        // Find user
        const user = await userModel.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if account is locked
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
            return res.status(403).json({
                success: false,
                message: `Account is locked. Please try again in ${minutesLeft} minutes`
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            // Update login attempts
            if(user.loginAttempts < 5){
                user.loginAttempts = (user.loginAttempts || 0) + 1;
            }else{
                user.loginAttempts = 0;
            }
            
            
            if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                user.lockUntil = Date.now() + LOCK_TIME;
                await user.save();
                return res.status(403).json({
                    success: false,
                    message: "Too many failed attempts. Account is locked for 15 minutes"
                });
            }
            
            await user.save();
            return res.status(400).json({
                success: false,
                message: `Invalid password. ${MAX_LOGIN_ATTEMPTS - user.loginAttempts} attempts remaining`
            });
        }

        // Reset login attempts on successful login
        user.loginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            userData: user
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getUserDetails = async (req, res) =>{
    const userId = req.params.id;
    try{
        const user = await userModel.findOne({ _id : userId }).exec();
        
        res.status(201).json({
          success: true,
          message: "User Data Fetched!",
          userDetails: user,
      });

      } catch(e){
        console.log(e);
        res.json({
          success: false,
          message: "Server Error!",
        });
      }
}

// forgot password using PHONE number
const forgotPassword = async (req, res) => {
    const { phoneNumber } = req.body;

    console.log('PhoneNumber',phoneNumber)

    if (!phoneNumber) {
        res.status(400).json({
            'success': false,
            'message': 'Please provide phone number'
        })
    }
    try {

        // user find and validate
        const user = await userModel.findOne({ phoneNumber: phoneNumber })
        // console.log(phone)
        if (!user) {
            return res.status(400).json({
                'success': false,
                'message': 'User Not Found!'
            })
        }

        // generate random otp
        const otp = Math.floor(100000 + Math.random() * 900000);

        // save OTP to the User's record
        user.otpReset = otp;
        user.otpResetExprires = Date.now() + 3600000;
        await user.save();

        // sending otp to phone number
        const isSent = await sendOtp(phoneNumber, otp)
        if (!isSent) {
            return res.status(500).json({
                'success': false,
                'message': 'Error Sending OTP'
            })
        }

        // success  message
        res.status(200).json({
            'success': true,
            'message': 'OTP Send Successfully!'
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            'success': false,
            'message': 'Server Error!'
        })


    }
}

// verify otp and set password
const verifyOtpAndPassword = async (req, res) => {
    const { phoneNumber, otp, password } = req.body;

    if (!phoneNumber || !otp || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide all required fields'
        });
    }

    try {
        const user = await userModel.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify OTP
        if (user.otpReset != otp || user.otpResetExprires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Check password history
        const isReused = await isPasswordReused(user, password);
        if (isReused) {
            return res.status(400).json({
                success: false,
                message: `Cannot reuse any of your last ${SECURITY_CONFIG.PASSWORD_HISTORY_LIMIT} passwords`
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Update password history
        await updatePasswordHistory(user, hashPassword);

        // Clear OTP fields
        user.otpReset = undefined;
        user.otpResetExprires = undefined;

        await user.save();

        return res.json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id; // Assuming userId is passed as route parameter
    const updatedData = req.body;
    try {

        if(updatedData.password){
            const randomSalt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, randomSalt);
            updateUser.password = hashPassword;
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });

        const commentUpdateData = {};
        if (updatedData.fullName) {
            commentUpdateData.authorName = updatedData.fullName;
        }

        await commentModels.updateMany({ author: userId },
            { $set: commentUpdateData });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating user profile' });
    }
};

// Update profile image
const updateProfileImage = async (req, res) => {
    const userId = req.params.id;


    if (!req.files || !req.files.profileImage) {
        return res.status(400).json({
            success: false,
            message: "Image not found"
        });
    }

    const { profileImage } = req.files;
    const imageName = `${Date.now()}-${profileImage.name}`;
    const imageUploadPath = path.join(__dirname, `../public/profiles/${imageName}`);

    try {
        await profileImage.mv(imageUploadPath);

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Delete the old profile image if it exists
        if (user.profileImage) {
            const oldImagePath = path.join(__dirname, `../public/profiles/${user.profileImage}`);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        user.profileImage = imageName;
        await user.save();

        await commentModels.updateMany({ author: userId },
            { $set: { userImage: imageName } });// updating comment userImage when profile is changed

        res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            profileImage: imageName,
            user: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
};

module.exports = { 
    createUser, 
    loginUser,
    getUserDetails,
    forgotPassword,
    verifyOtpAndPassword,
    updateUser,
    updateProfileImage
 };

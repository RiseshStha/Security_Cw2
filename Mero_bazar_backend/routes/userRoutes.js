const router = require('express').Router();
const userControllers = require("../controllers/userControllers");
const { authGuard, isAdmin } = require('../middleware/authGuard');

//making create user api
router.post('/create', userControllers.createUser);

router.post('/login', userControllers.loginUser);

router.get('/get_user/:id', userControllers.getUserDetails);

router.put('/update_user/:id', userControllers.updateUser);

router.put('/update_user_image/:id', userControllers.updateProfileImage);

router.post('/forgot_password',userControllers.forgotPassword)

router.post('/verify_otp',userControllers.verifyOtpAndPassword)

// New admin routes
router.get('/get-users', authGuard, userControllers.getAllUsers);
router.put('/toggle-block/:userId', authGuard, userControllers.toggleUserBlock);



module.exports = router;
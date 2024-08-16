const express = require('express');
const {
    signUp,
    loginCtrl,
    getUserProfileCtrl,
    sendForgotPass,
    updateProfile,
    changePass,
    sendOtpToMobile,
    verifyOTPByUser,
    sendOTPToEmail,
    verifyEmailOTPFromUser,
    verifyEmailOTPForsignup
} = require('../controller/userCtrl');
const auth = require('../middleware/auth');
const { upload } = require('../config/multerConfig'); // Ensure correct import
const verifyOTP = require('../middleware/verifyOTP');

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', loginCtrl);
userRouter.post('/profile', auth, getUserProfileCtrl);
userRouter.post('/sendEmail', sendForgotPass);
userRouter.post('/update/profile', auth, upload.single('user_profile'), updateProfile);
userRouter.post('/change/password', auth, changePass);
userRouter.post('/sendOTP', auth, sendOtpToMobile);
userRouter.post('/verify/otp', auth, verifyOTP, verifyOTPByUser);
userRouter.post('/sendOTP/email', auth, sendOTPToEmail);
userRouter.post('/verify/email/otp', auth, verifyOTP, verifyEmailOTPFromUser);
userRouter.post('/signup/verify/otp', verifyOTP, verifyEmailOTPForsignup);

module.exports = userRouter;

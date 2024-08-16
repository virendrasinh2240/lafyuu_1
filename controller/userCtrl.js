const User = require('../models/user');
const Token = require('../models/login');
const {
    sendForgotPassEmail,
    sendOTPToEmail
} = require('../emailConfig/sendEmail');
const generateAuthToken = require('../utils/generateToken');
const generatePass = require('../utils/generatePassword');
const {
    validEmail,
    validPassword,
    validStringInput,
    validDOB,
    validMobileNumber
} = require('../utils/validation');
const { hashpass, verifyPass } = require('../utils/hasspass');
const { gender } = require('../utils/checkGender');
const { sendOTP } = require('../utils/sendOTP');
const { generateOTP } = require('../utils/generateOTP');
const { generateOTPToken } = require('../utils/generateOTPToken');

exports.signUp = async (req, res, next) => {
    try {
        const { full_name, email, password, userRole } = req.body;

        const findUser = await User.findOne({ email });

        if (findUser) throw new Error('You are already registered with this email!');

        const validEmail = validEmail(email);
        const validPass = validPassword(password);
        const validName = validStringInput(full_name);

        const hash = await hashpass(validPass);

        const user = await new User({
            full_name: validName,
            email: validEmail,
            password: hash,
            user_name: validEmail,
            role: userRole || 'User'
        });

        const otp = generateOTP(1000, 9999);
        const otpToken = generateOTPToken(otp);

        await sendOTPToEmail(validEmail, otp);

        res.status(200).json({
            status: {
                message: 'OTP sent to your email!',
                code: 200,
                error: false
            },
            data: {
                otpToken
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.loginCtrl = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) throw new Error('User not registered!');

        const verifyPassword = await verifyPass(password, user.password);

        if (!verifyPassword) throw new Error('Invalid password!');

        const checkToken = await Token.findOne({ user_id: user._id });
        let token;

        if (checkToken) {
            token = await generateAuthToken(user._id);
            checkToken.active_token = token;
            await checkToken.save();
        } else {
            token = await generateAuthToken(user._id);
            await Token.create({
                user_id: user._id,
                active_token: token
            });
        }

        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            status: {
                message: 'Login successful!',
                code: 200,
                error: false
            },
            data: {
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getUserProfileCtrl = async (req, res, next) => {
    try {
        const user_id = req.user._id;

        const profile = await User.findById(user_id).select('-password');

        res.status(200).json({
            status: {
                message: 'Successfully fetched profile!',
                code: 200,
                error: false
            },
            data: {
                user: profile
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.sendForgotPass = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) throw new Error('User not registered yet!');

        const newPassword = generatePass(8);

        await sendForgotPassEmail(user.email, newPassword);

        user.password = await hashPass(newPassword);
        await user.save();

        res.status(200).json({
            message: 'Forgot password sent to your email successfully',
            code: 200,
            error: false
        });

    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { full_name, gender_id, DOB, mobile_number } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if (full_name) {
            user.full_name = validStringInput(full_name);
        }

        if (gender_id) {
            const verifyGender = gender.find(data => data.id === parseInt(gender_id));
            if (!verifyGender) throw new Error('Please provide valid gender ID!');
            user.gender = verifyGender.gender;
        }

        if (DOB) {
            user.DOB = validDOB(DOB);
        }

        if (mobile_number) {
            user.mobile_number = validMobileNumber(mobile_number).phone;
        }

        if (req.file) {
            user.user_profile = req.file.path;
        }

        await user.save();

        const userPass = user.toObject();
        delete userPass.password;

        res.status(200).json({
            status: {
                message: 'Profile updated successfully!',
                code: 200,
                error: false
            },
            data: {
                user: userPass
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.changePass = async (req, res, next) => {
    try {
        const { old_password, new_password } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if (!old_password) throw new Error('Please provide old password!');
        const verifyPass = await verifyPass(old_password, user.password);
        if (!verifyPass) throw new Error('The old password provided is incorrect.');
        if (!new_password) throw new Error('Please provide a new password!');
        if (new_password === old_password) throw new Error('The new password must be different from the old password.');

        const isStrong = validPassword(new_password);
        const encrypt = await hashPass(isStrong);
        user.password = encrypt;
        await user.save();

        res.status(200).json({
            status: {
                message: 'Password changed successfully!',
                code: 200,
                error: false
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.sendOtpToMobile = async (req, res, next) => {
    try {
        const { mobile_number } = req.body;
        const user_id = req.user._id;

        if (!mobile_number) throw new Error('Please provide mobile number!');

        const isValidMobileNumber = validMobileNumber(mobile_number);

        const otp = generateOTP(1000, 9999);
        const otpToken = generateOTPToken(otp);
        await sendOTP(otp, mobile_number);

        const user = await User.findById(user_id);
        user.mobile_number = isValidMobileNumber.phone;
        await user.save();

        res.status(200).json({
            status: {
                message: 'OTP sent to your mobile number!',
                code: 200,
                error: false
            },
            data: {
                otpToken
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.verifyOTPByUser = async (req, res, next) => {
    try {
        const { mobile_number, otp } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);

        if (user.mobile_number !== mobile_number) throw new Error('Incorrect mobile number!');
        const sendOTP = req.otp;

        if (!otp) throw new Error('Please enter OTP!');
        if (otp.length !== 4) throw new Error('Please provide 4 digit OTP!');
        if (parseInt(otp) !== sendOTP) throw new Error('Invalid OTP!');

        res.status(200).json({
            status: {
                message: 'OTP verified successfully!',
                code: 200,
                error: false
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.sendOTPToEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user_id = req.user._id;

        const user = await User.findById(user_id);
        if (!user) throw new Error('Please login first!');

        const isEmail = validEmail(email);

        const otp = generateOTP(1000, 9999);
        const otpToken = generateOTPToken(otp);
        await sendOTPToEmail(isEmail, otp);

        user.email = isEmail;
        user.user_name = isEmail;
        await user.save();

        res.status(200).json({
            status: {
                message: 'OTP sent to your email address!',
                code: 200,
                error: false
            },
            data: {
                otpToken
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.verifyEmailOTPFromUser = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user_id = req.user._id;
        const verifyOTP = req.otp;

        const user = await User.findById(user_id);

        if (!email) throw new Error('Please provide email!');
        if (user.email !== email) throw new Error('Invalid email address!');
        if (!otp) throw new Error('Please provide OTP!');
        if (otp.length !== 4) throw new Error('Please provide 4 digit OTP!');
        if (verifyOTP !== parseInt(otp)) throw new Error('Invalid OTP!');

        res.status(200).json({
            status: {
                message: 'OTP verified successfully!',
                code: 200,
                error: false
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.verifyEmailOTPForsignup = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const verifyOTP = req.otp;

        if (!email) throw new Error('Please provide email!');

        const userEmail = await User.findOne({ email });
        if (!userEmail) throw new Error('Please provide a valid email');
        if (!otp) throw new Error('Please provide OTP!');
        if (otp.length !== 4) throw new Error('Please provide 4 digit OTP!');
        if (verifyOTP !== parseInt(otp)) throw new Error('Invalid OTP!');

        res.status(200).json({
            status: {
                message: 'OTP verified successfully!',
                code: 200,
                error: false
            }
        });

    } catch (error) {
        next(error);
    }
};

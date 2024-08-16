const jwt = require("jsonwebtoken")

exports.generateOTPToken = (otp) => {
    try {
        const token = jwt.sign({ otp }, process.env.JWT_SECURE_KEY, { expiresIn: "5m" })
        return token
    } catch (err) {
        throw err
    }
}
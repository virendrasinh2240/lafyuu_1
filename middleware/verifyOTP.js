const jwt = require("jsonwebtoken")
const verifyOTP = async(req,res,next)=>{
    try{

        const Token = req.header("OTP")
        const decodeOTP = jwt.verify(token, process.env.JWT_SECURE_KEY)
        res.otp = decodeOTP.otp
        next()

    }catch(err){
        next(err)
    }
}
module.exports = verifyOTP
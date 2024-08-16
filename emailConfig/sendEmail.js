const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.NODEMAILER_EMAIL,
        pass:process.env.NODEMAILER_pASS
    },
    tls:{
        rejectUnauthorized:false
    }
})


exports.sendForgotPassEmail =async(email, password)=>{
    const mailOPtion ={
        from :process.env.NODEMAILER_EMAIL,
        to:email,
        subject:"forgot password",
        text:`your new password is ${password}`
    }
    try{
        await transporter.sendMail(mailOPtion)
    }catch(err){
        throw new Error(`error sending forgot password email ${err}`);
        
    }
}

exports.sendOTPToEmail = async(email, otp)=>{
    const mailOPtion = {
        from:process.env.NODEMAILER_EMAIL,
        to:email,
        subject:"otp varification",
        text:`your 4 digit otp is :${otp}`
    }
    try{
        await transporter.sendMail(mailOPtion)

    }catch(err){
        throw new Error("error sending forgot password email");
        
    }
}
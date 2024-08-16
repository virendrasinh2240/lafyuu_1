const jwt = require("jsonwebtoken")
const Token = require("../models/login")
const User = require("../models/user")

const auth = async(req,res,next)=>{

    try{
        const token = req.header("Authorization").replace("Bearer","")
        if(!token){
            throw new Error("please provide a valid token");
        }

        const decode = jwt.verify(token,process.env.JWT_SECURE_KEY)
        const userToken = await Token.findOne({user_id:decode.id})
        const user = await User.findOne({user_id:userToken.user_id})
        
        if(!user){
            throw new Error("user not found");
        }
        req.user = user
        next()

    }catch(err){
        res.status(400).json({
                status:400,
                message:"unauthorized"
        })

    }
}

module.exports = auth
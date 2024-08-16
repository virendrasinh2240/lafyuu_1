const jwt = require("jsonwebtoken")

const User = require("../models/user")

const generateAuthToken = async(id)=>{
    const user = await User.findOne({$where:{user_id:id}})
    if(!user){
        throw new Error("user not Register yet")
    }
    const token = jwt.sign({id},process.env.JWT_SECURE_KEY)
    return token
}

module.exports = generateAuthToken
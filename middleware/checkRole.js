const User = require("../models/user")
const checkRole = async (req,res,next)=>{
    try{
        const user = await User.findOne({user_id})
        if(user.role === "admin"){
            next()
        }else{
            throw new Error("access denied, you are not admin");
            
        }

    }catch(err){
        next(err)
    }
} 

module.exports = checkRole
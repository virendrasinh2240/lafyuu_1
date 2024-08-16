const bcrypt = require("bcryptjs")

const hashpass = async(pass) =>{
    try{
        const encryptPass = await bcrypt.hash(pass,8)
        return encryptPass
    }catch(err){
        throw err
    }
    } 

const varifypass = async (pass,hashpass) =>{
    try{
        const verifypass = bcrypt.compare(pass,hashpass)
        return verifypass
    }catch(err){
        throw err
    }
}

module.exports = {
    hashpass,
    varifypass
}
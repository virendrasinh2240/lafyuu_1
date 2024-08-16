const  mongoose = require("../config/dbconnect")

const TokenShema = new mongoose.Schema({
    token_id:{
        type:Number,
        allowNull:false,
        autoIncrement: true,
        unique: true
    },
    user_id:{
        type:Number
    },
    active_token:{
        type:String
    }
},{
    timestamps:false
})


module.exports=mongoose.model("Token",TokenShema)
const twilio = require("twilio")

const accountSid = process.env.account_sid;
const authToken = process.env.account_token;

const client = twilio(accountSid,authToken)

async function sendMessage(){
    try{
        const message = await client.message.create({
            body:"hello from twilio-node",
            to:"+xxxx" , //your number
            from:"+xxxx" // from a twilio number
        })
        console.log(message.sid)
        return message.sid


    }catch(err){
        throw err
    }
}


const sendOtp = async(otp,number)=>{
    try{
        const message = await client.message.create({
            body:`your otp is ${otp}`,
            from:process.env.TWILIO_NUMBER,
            to:`${number}`
        })
return message
    }catch(err){
        throw err
    }
}

module.exports = {

    sendMessage,
    sendOtp
    
}
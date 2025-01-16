const axios = require('axios')

const sendOtp = async (phone, otp) => {

    let isSent = false;


    //third party service provider
    const url = 'https://api.managepoint.co/api/sms/send'


    //required payload
    const payload = {
        'apiKey' : 'b40d73f0-4912-42d5-98af-15b25efcbdbd',
        'to' : phone,
        'message' : `Your OTP for Verification id ${otp}`

    }

    try{
        const res = await axios.post(url, payload);
        if(res.status == 200){
            isSent = true;
        }

    }catch(e){
        console.log('OTP Sending Fail : ', e.message)
    }


    return isSent;
}

module.exports = sendOtp;
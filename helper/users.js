var jwt = require('jsonwebtoken');
const CONFIG =  require("../config.json");
const { Send400, Send500, Send200 } = require('./userResponce');
const mailer=require("nodemailer")

const generateToken = (data) => {
    const payload = {
      data,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60 * 24,
    };
    try {
      const token = jwt.sign(payload, CONFIG.JWT_SECRET);
      return token;
    } catch (err) {
      return false;
    }
  };

 const oneTimeAuth= (token)=>{
    try {
      const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
      if(decoded){
        const _id=decoded.data._id
        const payload={
          token:token,
          userId:_id
        }
        return payload
      }
      return decoded
    } catch (error) {
      return false
    }
  }

    const authmiddleware = (req,res,next)=>{
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer") ||
        !req.headers.authorization.split(" ")[1]
      ) { 
        return Send400(res,"Please provide the token")
      }
      try{
        const accessToken = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(accessToken, CONFIG.JWT_SECRET);
        let userId = decoded.data._id;
        req._user = userId;
        return next();
        }catch(err){
          return Send500(res,"token not valid",err)
        }
    }
  
  const checkValidation = (name, phoneNumber, email, password,res) => {
    if (name && phoneNumber && email && password) {
       if(!validEmail(email)){
         Send400(res,"Please enter valid email")
       }else if(!validPhone(phoneNumber)){
        Send400(res,"Please enter 10digit mobile number")
       }else if(!validPwd(password)){
        Send400(res,"enter a strong password (like: A,a,1,#)")
       }else{
          return true
       }
  
    } else {
      Send400(res,"all fields mendatory")
    }
  };
 
 const validPwd = (pwd) => {
    // use the following script for min 8 letter password, with at least a symbol, upper and lower case letters and a number
    const pwdReg = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
   return pwdReg.test(pwd)?true:false
  };
  
  validPhone = (num) => {
    //only 10 number contains
    const phoneReg =/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
    return phoneReg.test(num)?true:false
  };
  
  validEmail = (email) => {
    //proper valid mail with aaa@gmail.co
    const emailReg = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z])(.[a-z]+)?$/;
    return emailReg.test(email)?true:false
  };

  const sendMail=async (info)=>{
   let mailTranspoter= mailer.createTransport({
    service:"gmail",
    auth:{
          user: CONFIG.USER_EMAIL,
          pass: CONFIG.USER_PASS
    }
   })
   let respo =await  mailTranspoter.sendMail(info)
   return respo.messageId
  }

  module.exports={
    oneTimeAuth,
    sendMail,
    validPwd,
    authmiddleware,
    checkValidation,
    generateToken
  }
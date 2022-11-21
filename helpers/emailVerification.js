const Otp = require("../models/otp");
const { sendEmail } = require("./sendMailer");

const generateOtp = () => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const sendVerificationCodeViaEmail = async (email) => {
  const otp = generateOtp();

  await sendEmail(email, "verification",`hey email ${ otp }`);

  const otpRecord = await Otp.create({ otp });

  if (otpRecord) {
    console.log("Otp Record == ", otpRecord._id);

    return otpRecord._id;
  }
  return false;
};

const verifyCodeViaEmail = async (_id, otp) => {
  const otpRecord = await Otp.findOne({ _id, otp });

  if (otpRecord) {
    await otpRecord.delete();
    return true;
  }
  return false;
};

module.exports = {
  sendVerificationCodeViaEmail,
  verifyCodeViaEmail,
};

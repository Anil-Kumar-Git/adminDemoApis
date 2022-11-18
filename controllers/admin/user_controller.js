const _ = require("lodash");
const User = require("../../models/users");
const md5 = require("md5");
const UserNotification = require("../../models/userNotification.js");


const addUser = async (req, res) => {
    code = 400;
    try {
      const body = _.pickBy(_.get(req, "body"), (value, key) => {
        return (
          key === "first_name" ||
          key === "last_name" ||
          key === "email" ||
          key === "mobile_phone" ||
          key === "mobile_without_code" ||
          key === "countryCode" ||
          key === "status" ||
          key === "customerType" ||
          key === "role" ||
          key === "password"
        );
      });
  
      let user_checkBy_email = null;
      if (body.email) {
        user_checkBy_email = await User.findOne({ email: body.email });
      }
      let user_checkBy_phone = null;
      if (body.mobile_phone) {
        user_checkBy_phone = await User.findOne({
          mobile_phone: body.mobile_phone,
        });
      }
  
      if (user_checkBy_email && user_checkBy_phone?.email !== null) {
        return res.status(code).json({
          code,
          message: "Email is already exits ",
          errors: {},
        });
      }
  
      if (user_checkBy_phone && user_checkBy_phone?.mobile_phone !== null) {
        return res.status(code).json({
          code,
          message: "Phone is already exits ",
          errors: {},
        });
      }
      body.password = md5(body.password);
      const user = await User.create(body);
  
      let userNotificationdata = {
        email: false,
        sms: false,
        push_notification: false,
        user_id: user._id,
      };
      await UserNotification.create(userNotificationdata);
      code = 200;
      return res.status(code).json({
        code,
        massage: "User Created Successfully",
        body,
        user_checkBy_email,
        user_checkBy_phone,
      });
    } catch (error) {
      return res.status(code).json({ code, message: error.message, errors: {errors:"catch errors"} });
    }
  };
  
  module.exports={
    addUser
  }
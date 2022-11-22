const User = require("../models/users");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");
const userAggregationData = require("../aggregation/user");
const _ = require("lodash");

const {
  sendVerificationCodeViaEmail,
  verifyCodeViaEmail,
} = require("../helpers/emailVerification");

//login

const login = async (req, res) => {
  let code = 400;
  try {
    const { value, type, password, userType } = req.body;

    let where = {};

    if (type == "email") {
      where.email = value;
    } else {
      where.mobile_phone = value;
    }

    let user = await User.findOne(where);

    if (user) {
      if (user.password === md5(password)) {
        if (user.status == "suspended") {
          return res.status(code).json({
            code,
            message: "Your account has been suspended by the admin",
            errors: {},
          });
        }

        if (user.status == "archived") {
          return res.status(code).json({
            code,
            message: "Your account has been archived by the admin",
            errors: {},
          });
        }

        delete user.password;

        if (
          (userType == "admin" && user.role != "admin") ||
          (userType == "user" && user.role != "user")
        ) {
          return res.status(code).json({
            code,
            message: "You are not a valid user to access this",
            errors: {},
          });
        }

        code = 200;

        if (req.body.fcmToken) {
          const { fcmToken } = req.body;

          console.log(fcmToken, "fcmToken");

          user = await User.findOneAndUpdate(
            { _id: user._id },
            { fcmToken },
            {
              new: true,
            }
          );
        }

        const accessToken = jwt.sign({ user }, process.env.JWTSECRET);

        let where = { _id: new mongoose.Types.ObjectId(user._id) };

        let userAggregation = userAggregationData();

        userAggregation.push({
          $match: where,
        });
        userAggregation.push({ $limit: 1 });

        const users = await User.aggregate(userAggregation);

        return res.status(code).json({
          code,
          message: "Login Successfully!",
          data: users[0],
          accessToken,
        });
      }
      return res.status(code).json({
        code,
        message: "Please provide valid password",
        errors: { password: "Please provide valid password" },
      });
    }

    const error =
      type == "email"
        ? "Please provide registered email address"
        : " Please provide registered phone number";

    const errors =
      type == "email"
        ? { email: "Please provide registered email address" }
        : { mobile_phone: " Please provide registered phone number" };

    return res.status(code).json({ code, message: error, errors });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: {} });
  }
};

// registration

const initiateRegister = async (req, res) => {
  let code = 400;
  const { value, type } = req.body;

  if (type == "email") {
    const userCount = await User.count({ email: value });

    if (userCount > 0) {
      return res.status(code).json({
        code,
        message: "Email already exists!",
        errors: { email: "Email already exists!" },
      });
    }
  } else {
    const userCount = await User.count({
      mobile_phone: value,
    });

    if (userCount > 0) {
      return res.status(code).json({
        code,
        message: "Mobile Phone already exists!",
        errors: { mobile_phone: "Mobile Phone already exists!" },
      });
    }
  }
  if (type == "email") {
    const verificationId = await sendVerificationCodeViaEmail(value);

    if (verificationId) {
      code = 200;
      return res.status(code).json({
        code,
        message: "Verification code sent!",
        data: { verificationId },
      });
    }
    return res.status(code).json({
      code,
      message: "Something went wrong!",
      errors: {},
    });
  } else {
    return res.status(code).json({
      code,
      message: "only email accepted",
      errors: {},
    });
    //   sendVerificationCode(type, value, (error, response) => {
    //     if (error) {
    //       return res.status(code).json({
    //         code,
    //         message: errorMessage(error),
    //         errors: {},
    //       });
    //     } else {
    //       code = 200;
    //       return res.status(code).json({
    //         code,
    //         message: "Verification code sent!",
    //         data: { verificationId: response.id },
    //       });
    //     }
    //   });
  }
};

const create = async (req, res) => {
  let code = 400;
  try {
    const body = _.pickBy(_.get(req, "body"), (value, key) => {
      return (
        key === "token" ||
        key === "verificationId" ||
        key === "email" ||
        key === "mobile_phone" ||
        key === "password" ||
        key === "countryCode" ||
        key === "mobile_without_code" ||
        key === "fcmToken"
      );
    });
    const { token, verificationId } = body;
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
    if (user_checkBy_email && user_checkBy_phone.email !== null) {
      return res.status(code).json({
        code,
        message: "email is already exits ",
        errors: {},
      });
    }

    if (user_checkBy_phone && user_checkBy_phone.mobile_phone !== null) {
      return res.status(code).json({
        code,
        message: "phone is already exits ",
        errors: {},
      });
    }

    if (body.email) {
      let success = await verifyCodeViaEmail(verificationId, token);
      if (!success) {
        return res.status(code).json({
          code,
          message:
            "The one time passcode is incorrect. Please re-enter or resend code",
          errors: {},
        });
      } else {
        code = 200;
        body.password = md5(body.password);
        delete body.verificationId;
        delete body.token;

        body.emailVerified = true;
        body.mobilePhoneVerified = false;
        // body.stripeCustomerId = await addNewCustomer({ email: body.email });
        let user = await User.create(body);
        // newUserNotification(user);
        return res.status(code).json({
          code,
          message: "User Created",
          data: user,
          accessToken: jwt.sign({ user }, process.env.JWTSECRET),
        });
      }
    } else {
      return res.status(code).json({
        code,
        message: "only email accepted",
        errors: {},
      });
      // checkVerificationCode(token, verificationId, async (error, response) => {
      //   console.log(response);
      //   if (error) {
      //     return res.status(code).json({
      //       code,
      //       message: errorMessage(error),
      //       errors: {},
      //     });
      //   } else {
      //     code = 200;
      //     body.password = md5(body.password);
      //     delete body.verificationId;
      //     delete body.token;

      //     body.emailVerified = body.email ? true : false;
      //     body.mobilePhoneVerified = body.mobile_phone ? true : false;

      //     let user = await User.create(body);
      //     newUserNotification(user);
      //     return res.status(code).json({
      //       code,
      //       message: "User Created",
      //       data: user,
      //       accessToken: jwt.sign({ user }, process.env.JWTSECRET),
      //     });
      //   }
      // });
    }
  } catch (err) {
    return res
      .status(code)
      .json({ code, message: err.message, errors: { error: err.message } });
  }
};

// forgetPassword

const initiateForgotPassword = async (req, res) => {
  const { type, value, userType } = req.body;
  let code = 400;

  let where = {};

  if (type == "email") {
    where.email = value;
  } else {
    where.mobile_phone = value;
  }

  const user = await User.findOne(where);

  if (user) {
    if (
      (userType == "admin" && user.role != "admin") ||
      (userType == "user" && user.role != "user")
    ) {
      return res.status(code).json({
        code,
        message: "You are not a valid user to access this",
        errors: {},
      });
    }

    if (type == "email") {
      const verificationId = await sendVerificationCodeViaEmail(user.email);

      if (verificationId) {
        code = 200;
        return res.status(code).json({
          code,
          message: "Verification code sent!",
          data: { verificationId },
        });
      }
      return res.status(code).json({
        code,
        message: "Something went wrong!",
        errors: {},
      });
    } else {
      return res.status(code).json({
        code,
        message: "only type email",
        errors: {},
      });
      // sendVerificationCode(type, value, (error, response) => {
      //   if (error) {
      //     return res.status(code).json({
      //       code,
      //       message: errorMessage(error),
      //       errors: {},
      //     });
      //   } else {
      //     code = 200;
      //     return res.status(code).json({
      //       code,
      //       message: "Verification code sent!",
      //       data: { verificationId: response.id },
      //     });
      //   }
      // });
    }
  } else {
    const error =
      type == "email"
        ? "Please provide registered email address"
        : " Please provide registered phone number";

    const errors =
      type == "email"
        ? { email: "Please provide registered email address" }
        : { mobile_phone: " Please provide registered phone number" };

    return res.status(code).json({ code, message: error, errors });
  }
};

const verifyForgotPasswordCode = async (req, res) => {
  let code = 400;

  try {
    const { token, verificationId, value, type } = req.body;

    let where = {};

    if (type == "email") {
      where.email = value;
    } else {
      where.mobile_phone = value;
    }

    const user = await User.findOne(where);

    if (type == "mobile_phone") {
      return res.status(code).json({
        code,
        message: "only email type accepet",
        errors: {},
      });
      // checkVerificationCode(token, verificationId, async (error, response) => {
      //   if (error) {
      //     return res.status(code).json({
      //       code,
      //       message: errorMessage(error),
      //       errors: {},
      //     });
      //   } else {
      //     code = 200;
      //     return res.status(code).json({
      //       code,
      //       message: response.status,
      //       accessToken: jwt.sign({ _id: user._id }, process.env.JWTSECRET, {
      //         expiresIn: "300s",
      //       }),
      //     });
      //   }
      // });
    } else {
      let success = await verifyCodeViaEmail(verificationId, token);

      if (!success) {
        return res.status(code).json({
          code,
          message:
            "The one time passcode is either incorrect or expired. Please re-enter or resend code",
          errors: {},
        });
      } else {
        code = 200;
        return res.status(code).json({
          code,
          message: "Otp matched",
          accessToken: jwt.sign({ _id: user._id }, process.env.JWTSECRET, {
            expiresIn: "300s",
          }),
        });
      }
    }
  } catch (err) {
    return res
      .status(code)
      .json({ code, message: err.message, errors: { error: err.message } });
  }
};

//password change forgetPwd

const updatePassword = async (req, res) => {
  let code = 400;
  try {
    let { body } = req;
    let { _id } = req;

    if (_id) {
      code = 200;
      body.password = md5(body.password);
      await User.findOneAndUpdate({ _id }, body);
      return res.status(code).json({
        code,
        message: "Password Changed",
        data: {},
      });
    } else {
      return res.status(code).json({
        code,
        message: "id not found",
        data: {},
      });
    }
  } catch (err) {
    return res
      .status(code)
      .json({ code, message: err.message, errors: { error: err.message } });
  }
};

// get admin profile 

const get = async (req, res) => {
  let code = 400;
  try {
    let { _id } = req.user;
     console.log(req.params,"param")
    if (_.has(req.params, "id")) {
      _id = req.params.id;
    }

    _id = mongoose.Types.ObjectId(_id);

    let $match = {
      _id,
    };

    let userAggregation = userAggregationData();

    userAggregation.push({
      $match,
    });

    const users = await User.aggregate(userAggregation);

    if (users.length > 0) {
      const user = users[0];

      code = 200;
      return res.status(code).json({
        code,
        message: "Data fetched",
        data: user,
      });
    }
    return res.status(code).json({
      code,
      message: "No user found",
      errors: { error: "No user found" },
    });
  } catch (err) {
    return res
      .status(code)
      .json({ code, message: err.message, errors: { error: err.message } });
  }
};

//reset password 

const resetPassword = async (req, res) => {
  let code = 400;
  try {
    let { oldPassword, newPassword } = req.body;
    oldPassword = md5(oldPassword);
    newPassword = md5(newPassword);

    let { _id } = req.user;

    let { password } = await User.findById(_id);

    if (oldPassword == password) {
      code = 200;
      await User.findOneAndUpdate({ _id }, { password: newPassword });
      return res.status(code).json({
        code,
        message: "Password Changed",
        data: {},
      });
    }
    return res.status(code).json({
      code,
      message: "Old password does not match",
      errors: {},
    });
  } catch (err) {
    return res
      .status(code)
      .json({ code, message: err.message, errors: { error: err.message } });
  }
};

//delete account permanently

const deletePermanently = async (req, res) => {
  let code = 400;
  try {
    let { _id } = req.user;

    code = 200;

    await User.deleteOne({ _id });

    return res.status(code).json({
      code,
      message: "Your account has been deleted!",
      data: {},
    });
  } catch (err) {
    return res
      .status(code)
      .json({ code, message: err.message, errors: { error: err.message } });
  }
};

// update profile 

const updateProfile = async (req, res) => {
  try {
    const body = _.pickBy(_.get(req, "body"), (value, key) => {
      return (
        key === "email" ||
        key === "mobile_phone" ||
        key === "countryCode" ||
        key === "mobile_without_code"
      );
    });
    const { email, mobile_phone, countryCode, mobile_without_code } = body;
    if (!email && !mobile_phone && !countryCode && !mobile_without_code) {
      return res.status(400).json({
        code: 400,
        message: "No value Is found",
      });
    }
    let user = await User.findByIdAndUpdate(req.user._id, body, { new: true });
    return res.status(200).json({
      code: 200,
      message: "Profile Updated ",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      code: 400,
      message: error.message,
      errors: { error: error.message },
    });
  }
};


module.exports = {
  login,
  create,
  initiateRegister,
  initiateForgotPassword,
  verifyForgotPasswordCode,
  updatePassword,
  get,
  resetPassword,
  deletePermanently,
  updateProfile
};

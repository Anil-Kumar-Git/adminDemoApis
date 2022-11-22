const _ = require("lodash");
const User = require("../../models/users");
const md5 = require("md5");
const UserNotification = require("../../models/userNotification.js");
const Service = require("../../models/service");
const Order_details = require("../../models/order_details")
const mongoose = require("mongoose");

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

  // dasboard status


const handleDashBordStats = async (req, res) => {
  code = 400;
  try {
    let service = await Service.find({});
    let data = {};
    await Promise.all(
      service.map(async (service) => {
        let sercer_check = await Order_details.count({
          service_id: service._id,
        });
        data[service.name] = sercer_check;
      })
    );
    code = 200;
    return res.status(code).json({
      code,
      data,
    });
  } catch (error) {
    return res.status(code).json({ code, message: error.message, errors: {} });
  }
};

//get all users

const getAllUser = async (req, res) => {
  let code = 400;
  try {
    const { type, status } = req.body;
    const where = {
      _id: { $ne: mongoose.Types.ObjectId(req.user._id) },
    };

    if (type && type !== "") {
      where.customerType = type;
    }
    if (status && status !== "") {
      where.status = status;
    }

    const users = await User.find(where).select("-stripeCustomerId  -password -__v").exec();
    const count = await User.count(where);

    if (users) {
      code = 200;
      return res.status(code).json({
        code,
        datva: req.user._id,
        data: {
          users,
        },
      });
    }

    return res.status(code).json({
      code,
      message: "No user ",
      errors: { error: "No user " },
    });
  } catch (err) {
    return res.status(code).json({ code, message: err.message, errors: {} });
  }
};

// get user by id

const getUserByid = async (req, res) => {
  let code = 400;
  try {
    const { id } = req.params;

    const users = await User.findById(id).select("-stripeCustomerId  -password -__v").exec();
    if (users) {
      code = 200;
      return res.status(code).json({
        code,
        data: {
          users,
        },
      });
    }

    return res.status(code).json({
      code,
      message: "No user ",
      errors: { error: "No user " },
    });
  } catch (err) {
    return res.status(code).json({ code, message: err.message, errors: {} });
  }
};

// delete user 

const deleteUser = async (req, res) => {
  let code = 400;
  try {
    const { id } = req.params;
    const { type } = req.query;
    let checkuser = await User.findById(id);

    if (checkuser.status == type) {
      return res.status(code).json({
        code,
        message: "User Status is Already "+type,
        errors: { error: "User Status is Already  Archived" },
      });
    }

    await User.findByIdAndUpdate(id, { status: type }, { new: true });
    code = 200;
    return res.status(code).json({
      code,
      message: "User Deleted Successful",
      checkuser,
    });
  } catch (err) {
    return res.status(code).json({ code, message: err.message, errors: {} });
  }
};

// update user

const updateUser = async (req, res) => {
  let code = 400;
  try {
    const { id } = req.params;
    const body = _.pickBy(_.get(req, "body"), (value, key) => {
      return (
        key === "first_name" ||
        key === "last_name" ||
        key === "profile_image" ||
        key === "email" ||
        key === "mobile_phone" ||
        key === "mobile_without_code" ||
        key === "emailVerified" ||
        key === "mobilePhoneVerified" ||
        key === "countryCode" ||
        key === "status" ||
        key === "customerType" ||
        key === "role"
      );
    });

    let checkEmail = await User.find({ email: body.email, _id: { $ne: id } });
    let user_checkBy_email = null;
    if (body.email) {
      user_checkBy_email = await User.findOne({
        email: body.email,
        _id: { $ne: id },
      });
    }

    let user_checkBy_phone = null;
    if (body.mobile_phone) {
      user_checkBy_phone = await User.findOne({
        mobile_phone: body.mobile_phone,
        _id: { $ne: id },
      });
    }
    if (user_checkBy_email) {
      return res.status(code).json({
        code,
        message: "Email already Exits",
        errors: { error: "Email already Exits" },
        user_checkBy_email,
      });
    }

    if (user_checkBy_phone) {
      return res.status(code).json({
        code,
        message: "Phone is already exits ",
        errors: { error: "Phone is already exits " },
      });
    }

    const usercheck = await User.findById(id);
    if (usercheck.status !== body.status) {
      // accountStatusNotification(usercheck, body.status);
    }
    const user = await User.findByIdAndUpdate(id, body, { new: true });
    if (user) {
      code = 200;
      return res.status(code).json({
        code,
        massage: "User Updated Successfully",
        ddd: req.user,
      });
    }
    return res.status(code).json({
      code,
      message: "No user found",
      errors: { error: "No user found" },
    });
  } catch (error) {
    return res.status(code).json({ code, message: error.message, errors: {} });
  }
};

// reset password

const resetPassword = async (req, res) => {
  let code = 400;
  try {
    const { id } = req.params;
    const body = _.pickBy(_.get(req, "body"), (value, key) => {
      return key === "password";
    });
    let paswd = md5(body.password);

    const user = await User.findByIdAndUpdate(id, { password: paswd }, { new: true });
    if (user) {
      code = 200;
      return res.status(code).json({
        code,
        massage: "User  Password Updated Successfully",
      });
    }
    return res.status(code).json({
      code,
      message: "No user found",
      errors: { error: "No user found" },
    });
  } catch (error) {
    return res.status(code).json({ code, message: error.message, errors: {} });
  }
};

  
  module.exports={
    addUser,
    handleDashBordStats,
    getAllUser,
    getUserByid,
    resetPassword,
    updateUser,
    deleteUser
  }
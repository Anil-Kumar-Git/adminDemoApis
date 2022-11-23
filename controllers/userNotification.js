const NotificationLog = require("../models/notificationLogs.js");
const UserNotification = require("../models/userNotification.js");

const getUserNotificationByUserId = async (req, res) => {
  try {
    const { _id } = req.user;
    const notification = await UserNotification.findOne({ user_id: _id });
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: notification,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const getUserNotificationall = async (req, res) => {
  try {
    const { _id } = req.user;
    const notification = await UserNotification.find({ user_id: _id });
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: notification,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const createUserNotification = async (req, res) => {
  let code = 200;
  try {
   
    req.body.user_id = req.user._id;
    let notification = await UserNotification.create(req.body);
    code = 200;
    return res.status(code).json({
      code,
      message: "Data created",
      data: notification,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const deleteUserNotificationByUserId = async (req, res) => {
  try {
    const { _id } = req.user;
    const notification = await UserNotification.findOneAndDelete({
      user_id: _id,
    });
    code = 200;
    return res.status(code).json({
      code,
      message: "Data Deleted",
      data: notification,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const updateUserNotificationByUserId = async (req, res) => {
  try {
    const { _id } = req.user;
    const notification = await UserNotification.findOneAndUpdate(
      {
        user_id: _id,
      },
      req.body,
      {
        new: true,
      }
    );
    code = 200;
    return res.status(code).json({
      code,
      message: "Data Updated",
      data: notification,
    });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const deleteSingleNotification = async (req, res) => {
  code = 400;
  try {
    const { id } = req.params;
    await NotificationLog.findByIdAndDelete(id);
    code = 200;
    return res.status(code).json({
      code,
      message: "Notification deleted Successfull",
    });
  } catch (err) {
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const deleteAllReadedNotification = async (req, res) => {
  code = 400;
  try {
    const { _id } = req.user;
    await NotificationLog.deleteMany({
      userId:_id,
      status:true
    });
    code = 200;
    return res.status(code).json({
      code,
      message: "Notification deleted Successfull",
    });
  } catch (error) {
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

module.exports = {
  getUserNotificationByUserId,
  createUserNotification,
  deleteUserNotificationByUserId,
  updateUserNotificationByUserId,
  deleteSingleNotification,
  deleteAllReadedNotification
};

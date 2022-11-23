const AdminNotification = require("../models/adminNotification.js");
const AdminTemplete =require("../models/tempModal")
// const { fetchDynamicTemplates } = require("../helpers/sg.js");
const _ = require("lodash");
const { jsonDataSendEmail } = require("../helpers/notificationKey");
const {templets } =require ("../helpers/notificationKey")

const getadminNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await AdminNotification.findById(id);
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

const getAllNotification = async (req, res) => {
  code = 400;
  try {
    let sent_data = [];
    let allData = jsonDataSendEmail();
    let check_notification = await AdminNotification.find({});
    if (check_notification?.length <= 0) {
      await AdminNotification.insertMany(allData);
      sent_data = await getAlldata();
    } else {
      sent_data = await getAlldata();
    }
    code = 200;
    return res.status(code).json({
      code,
      message: "Data fetched",
      data: sent_data,
    });
  } catch (err) {
    return res.status(code).json({ code, message: err.message, errors: err });
  }
};

const getAlldata = async () => {
  let userEmail = await AdminNotification.find({ type: "email", user: "user" });
  let userSms = await AdminNotification.find({ type: "sms", user: "user" });

  let adminEmail = await AdminNotification.find({
    type: "email",
    user: "admin",
  });
  let adminSms = await AdminNotification.find({ type: "sms", user: "admin" });

  return {
    userEmail,
    userSms,
    adminEmail,
    adminSms,
  };
};

const createAdminNotification = async (req, res) => {
  try {
    let notification = await AdminNotification.create(req.body);
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

const deleteAdminNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await AdminNotification.findByIdAndDelete(id);
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

const updateAdminNotificationById = async (req, res) => {
  let code = 200;
  
    try {
      const { id } = req.params;
  
      const body = req.body
      // _.pickBy(_.get(req, "body"), (value, key) => {
      //   return key === "sgTemplateId" || key === "sgTemplateName" || key === "status";
      // });
  
      const updatedNotification = await AdminNotification.findByIdAndUpdate(
        id,
        body,
        {
          new: true,
          upsert: true,
        }
      );
  
      return res.status(code).json({
        code,
        message: "Notification Updated",
        data: updatedNotification,
      });
    } catch (err) {
      code = 500;
      return res.status(code).json({ code, message: err.message, errors: {} });
    }
};

const fetchSgTemplates = async (req, res) => {
  let code = 200;
  try {
    const tempCheck = await AdminTemplete.find({});
  return res
      .status(code)
      .json({ code, message: "Templates Fetched", data: tempCheck });
  } catch (err) {
    code = 500;
    return res.status(code).json({ code, message: err.message, errors: {} });
  }
};
module.exports = {
  getadminNotificationById,
  createAdminNotification,
  deleteAdminNotificationById,
  updateAdminNotificationById,
  fetchSgTemplates,
  getAllNotification,
};

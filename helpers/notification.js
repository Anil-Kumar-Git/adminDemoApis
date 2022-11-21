const { sendEmail } = require("./sg");
const { sendPush } = require("./fcm");
const { sendSms } = require("./messageBird");
const UserNotification = require("../models/userNotification");
const moment = require("moment");
const NotificationLog = require("../models/notificationLogs");
const User = require("../models/users.js");


/////  Create Order Notificatiion
const OnOrderPushNotification = async (registration_ids, order,data) => {
  let body = "Thank you for placing order with us";
  var message = {
    registration_ids,
    collapse_key: "green",

    notification: {
      title: "Order Placed",
      body,
    },

    data,
  };
  await sendPush(message);

  // const log = {
  //   userId: order.user_id,
  //   title: body,
  //   discription: "Thank you for placing order with us",
  //   data,
  // };

  // await NotificationLog.create(log);
};

const onOrderEmailNotification = async (email, display_name) => {
  const { ON_ORDER_TEMPLATE } = process.env;

  const templateData = {
    display_name,
    statusText: "Order Palced",
  };
  await sendEmail(email, ON_ORDER_TEMPLATE, templateData);
  return true;
};

const onOrderNotifications = async (user, order) => {
  try {
    const nottiCount = await NotificationLog.count({status: false,userId: order.user_id})
    let data = {
      order,
      notification_count:Number(nottiCount)+1,
      type: "onOrder",
    };
    const userNotificationSettings = await UserNotification.findOne({user_id: user._id});
    if (userNotificationSettings?.email && user?.email !== null) {
      let name = "";
      if (user.first_name !== null) {
        name = `${user.first_name} ${user.last_name}`;
      }
      await onOrderEmailNotification(user.email, name);
    }
    if (userNotificationSettings?.sms && user?.mobile_phone !== null) {
      await sendSms(
        [user.mobile_phone],
        "Congratulations! Your order has been placed!"
      );
    }
    if (userNotificationSettings?.push_notification) {
      await OnOrderPushNotification([user.fcmToken], order,data);
    }
    const log = {
      userId: order.user_id,
      title: "Order Placed",
      discription: "Thank you for placing order with us",
      data,
      delete_id:order._id
    };
   let datass = await NotificationLog.create(log);
    const { email, mobile_phone, fcmToken } = user;
  } catch (err) {
    console.log(err.message);
  }
};


/////New user Sign Up Notification 

const newUserPushNotification = async (registration_ids, user,data) => {
  const nottiCount = await NotificationLog.count({status: false,userId: user._id})
  let body = "Hi , Welcome to the BrightSwipe";
  var message = {
    registration_ids,
    collapse_key: "green",
    notification: {
      title: "Thanks for Sign Up",
      body,
    },
    data,
  };
  await sendPush(message);

  // const log = {
  //   userId: user._id,
  //   title: body,
  //   discription: "Thank you for Sign Up in Bright Swipe",
  //   data,
  // };

  // await NotificationLog.create(log);
};

const newEmailNotification = async (email, display_name) => {
  const { USER_WELCOME_TEMPLATE } = process.env;

  const templateData = {
    name: display_name,
  };
  await sendEmail(email, USER_WELCOME_TEMPLATE, templateData);
  return true;
};

const newAdminEmailNotification = async (email, display_name) => {
  const { ADMIN_NEW_USER_TEMPLATE } = process.env;

  const templateData = {
    name: display_name,
  };
  await sendEmail(email, ADMIN_NEW_USER_TEMPLATE, templateData);
  return true;
};

const newUserNotification = async (user) => {
  try {
    const nottiCount = await NotificationLog.count({status: false,userId: user._id})
    let data = {
      user,
      notification_count:Number(nottiCount)+1,
      type: "onSignUp",
    };
   
    const userNotificationSettings = await UserNotification.findOne({
      where: { user_id: user._id },
    });
    const admin = await User.findOne({ role: "admin" });
    if (userNotificationSettings.email && user.email !== null) {
      let name = "";
      if (user.first_name !== null) {
        name = `${user.first_name} ${user.last_name}`;
      }
      await newEmailNotification(user.email, name);
    }
    if (admin.email !== null) {
      let name = "";
      if (user.first_name !== null) {
        name = `${user.first_name} ${user.last_name}`;
      }
      await newAdminEmailNotification(admin.email, name);
    }

    if (userNotificationSettings.push_notification) {
      await newUserPushNotification([user.fcmToken], user,data);
    }

    const log = {
      userId: user._id,
      title: "Hi , Welcome to the BrightSwipe",
      discription: "Thank you for Sign Up in Bright Swipe",
      data,
    };
  
    await NotificationLog.create(log);
  } catch (error) {
    console.log(error.message);
  }
};


/////  User Account Status Change

const accountStatusEmailNotification = async (email, display_name,status) => {
  const { USER_ACCOUNT_STATUS_TEMPLATE } = process.env;

  const templateData = {
    name: display_name,
    status:status
  };
  await sendEmail(email, USER_ACCOUNT_STATUS_TEMPLATE, templateData);
  return true;
};

const accountStatusNotification = async (user , status) => {
  try {
    if ( user.email !== null) {
      let name = "";
      if (user.first_name !== null) {
        name = `${user.first_name} ${user.last_name}`;
      }
      await accountStatusEmailNotification(user.email, name ,status);
    }
  } catch (error) {
    console.log(error.message);
  }
};


///recheck notification

const OnOrderRecheckPushNotification = async (registration_ids, order,data) => {
  let body = "Thank you for rechecking order with us";
  var message = {
    registration_ids,
    collapse_key: "green",

    notification: {
      title: "Order Rechecked",
      body,
    },

    data,
  };
  await sendPush(message);

  // const log = {
  //   userId: order.user_id,
  //   title: body,
  //   discription: "Thank you for placing order with us",
  //   data,
  // };

  // await NotificationLog.create(log);
};

const onOrderRecheckEmailNotification = async (email, display_name) => {
  const { ON_ORDER_TEMPLATE } = process.env;

  const templateData = {
    display_name,
    statusText: "Order Recheck Successfull",
  };
  await sendEmail(email, ON_ORDER_TEMPLATE, templateData);
  return true;
};

const onOrderRecheckNotifications = async (user, order) => {
  try {
    const nottiCount = await NotificationLog.count({status: false,userId: order.user_id})
    let data = {
      order,
      notification_count:Number(nottiCount)+1,
      type: "recheckOrder",
    };
    const userNotificationSettings = await UserNotification.findOne({user_id: user._id});
    if (userNotificationSettings?.email && user?.email !== null) {
      let name = "";
      if (user.first_name !== null) {
        name = `${user.first_name} ${user.last_name}`;
      }
      await onOrderRecheckEmailNotification(user.email, name);
    }
    if (userNotificationSettings?.sms && user?.mobile_phone !== null) {
      await sendSms(
        [user.mobile_phone],
        "Congratulations! Order Recheck is Successful"
      );
    }
    if (userNotificationSettings?.push_notification) {
      await OnOrderRecheckPushNotification([user.fcmToken], order,data);
    }
    const log = {
      userId: order.user_id,
      title: "Order Rechecked",
      discription: "Thank you for rechecking order with us",
      data,
      delete_id:order._id
    };
   let datass = await NotificationLog.create(log);
    const { email, mobile_phone, fcmToken } = user;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  onOrderNotifications,
  newUserNotification,
  accountStatusNotification,
  onOrderRecheckNotifications
};

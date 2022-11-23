const { check } = require("express-validator");
const prepareValidationError = require("../helpers/prepareValidationError");

const validateCreateUserNotification = [
    check("email", "email field is missing").exists(),
    check("sms", "sms field is missing").exists(),
    check("push_notification", "push_notification field is missing").exists(),
    (req, res, next) => {
      prepareValidationError(req, res, next);
    },
  ];

  const validateCreateAdminNotification = [
    check("key", "key field is missing").exists(),
    check("text", "text field is missing").exists(),
    check("type", "type field is missing").exists(),
    check("user", "user field is missing").exists(),
    check("status", "status field is missing").exists(),
    (req, res, next) => {
      prepareValidationError(req, res, next);
    },
  ];
  

  module.exports = {
    validateCreateAdminNotification,
    validateCreateUserNotification
  };
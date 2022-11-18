const { check } = require("express-validator");
const prepareValidationError = require("../helpers/prepareValidationError");

const validateVerifyInit = [
  check("type", "type field is missing").exists(),
  check("type")
    .isIn(["email", "mobile_phone"])
    .withMessage("type must be mobile_phone | email"),
  check("value", "value field is required").exists(),
  check("value", "value field is required").notEmpty(),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
  
];

const validateGooglelogin = [
  check("googleId", "googleId field is missing").exists(),
  check("email", "email field is required").exists(),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
  
];

const validateCreateUser = [
  check("verificationId", "verificationId field is missing").exists(),
  check("verificationId", "verificationId field is required").notEmpty(),
  check("token", "token field is missing").exists(),
  check("token", "token field is required").notEmpty(),
  check("password", "password field is missing").exists(),
  check("password", "password field is required").notEmpty(),
  check("mobile_phone", "mobile_phone is required").optional().notEmpty(),
  check("email", "email is invalid").optional().isEmail(),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
];
const validateForgot = [
  check("verificationId", "verificationId field is missing").exists(),
  check("verificationId", "verificationId field is required").notEmpty(),
  check("token", "token field is missing").exists(),
  check("token", "token field is required").notEmpty(),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
];
const validateAuthenticate = [
  check("password", "password field is missing").exists(),
  check("password", "password field is required").notEmpty(),
  check("userType", "userType field is missing").exists(),
  check("userType")
    .isIn(["user", "admin"])
    .withMessage("userType must be user | admin"),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
];
const validateUpdate = [
  check("password", "password field is missing").exists(),
  check("password", "password field is required").notEmpty(),
  check("userType", "userType field is missing").exists(),
  check("userType")
    .isIn(["user", "admin"])
    .withMessage("userType must be user | admin"),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
];

const validateCreateByAdmin = [
  check("first_name", "first_name field is missing").exists(),
  check("last_name", "last_name field is missing").exists(),
  check("display_name", "display_name field is missing").exists(),
  check("email", "email field is missing").exists(),
  check("mobile_phone", "mobile_phone field is missing").exists(),
  check("genres", "genres field is missing").exists(),
  check("dob", "dob field is missing").exists(),
  check("gender", "gender field is missing").exists(),
  check("profile_image", "profile_image field is missing").exists(),
  check("countryCode", "countryCode field is missing").exists(),
  check("mobile_without_code", "mobile_without_code field is missing").exists(),
  check("password", "password field is missing").exists(),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
];


module.exports = {
  validateVerifyInit,
  validateCreateUser,
  validateForgot,
  validateAuthenticate,
  validateUpdate,
  validateCreateByAdmin,
  validateGooglelogin
};

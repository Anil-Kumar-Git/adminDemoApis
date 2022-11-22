const { check } = require("express-validator");
const prepareValidationError = require("../helpers/prepareValidationError");


const validatePage = [
  check("title", "title is missing").exists(),
  check("title", "title field is required").notEmpty(),
  check("slug", "slug is missing").exists(),
  check("slug", "slug field is required").notEmpty(),
  check("image", "image is missing").exists(),
  check("image", "image field is required").notEmpty(),
  check("content", "content is missing").exists(),
  check("content", "content field is required").notEmpty(),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
];


module.exports = {
  validatePage,
};

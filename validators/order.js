const { check } = require("express-validator");
const prepareValidationError = require("../helpers/prepareValidationError");

const validateCreateOrder = [
    check("service_id", "service_id field is missing").exists(),
    check("total", "total field is missing").exists(),
    check("cardId", "cardId field is missing").exists(),
    check("service_id", "service_id field Must is Array of service id ").isArray(),
    (req, res, next) => {
      prepareValidationError(req, res, next);
    },
  ];

  

  const OldvalidateRecheckOrder = [
    check("service_id", "service_id field is missing").exists(),
    check("service_id", "service_id field Must is Array of service id ").isArray(),
    (req, res, next) => {
      prepareValidationError(req, res, next);
    },
  ];
const validateRecheckOrder = [
  check("service_id", "service_id field is missing").exists(),
  check("orderId", "orderId field is missing").exists(),
  check("service_id", "service_id field Must is Array of service id ").isArray(),
  (req, res, next) => {
    prepareValidationError(req, res, next);
  },
];
  

  module.exports = {
    validateCreateOrder,
    validateRecheckOrder,
    OldvalidateRecheckOrder
  };
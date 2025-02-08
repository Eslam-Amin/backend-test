const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const validationCheck = (req, res, next) => {
  const errors = validationResult(req);
  // If there are validation errors, return the errors as a response.
  if (!errors.isEmpty()) {
    return next(new ApiError(errors.array()[0].msg, 400));
  }
  next();
};

module.exports = validationCheck;

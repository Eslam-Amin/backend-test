const { body } = require("express-validator");

class AuthValidator {
  static loginValidator = [
    body("email")
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Please provide a valid email address."),

    body("password")
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long.")
  ];

  static validateRegisterUser = [
    // First Name validation
    body("firstName")
      .isString()
      .withMessage("First name must be a string.")
      .isLength({ min: 2, max: 32 })
      .withMessage("First name must be between 2 and 32 characters.")
      .notEmpty()
      .withMessage("First name is required."),

    // Last Name validation
    body("lastName")
      .isString()
      .withMessage("Last name must be a string.")
      .isLength({ min: 2, max: 32 })
      .withMessage("Last name must be between 2 and 32 characters.")
      .notEmpty()
      .withMessage("Last name is required."),

    // Email validation
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address.")
      .notEmpty()
      .withMessage("Email is required."),

    // Date of Birth validation
    body("dateOfBirth")
      .isDate()
      .withMessage("Date of birth is required and must be a valid date.")
      .notEmpty()
      .withMessage("Date of birth is required."),

    // Password validation
    body("password")
      .isString()
      .withMessage("Password must be a string.")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters.")
      .notEmpty()
      .withMessage("Password is required."),

    // Confirm Password validation
    body("confirmPassword")
      .isString()
      .withMessage("Confirm password must be a string.")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Confirm password must match the password.")
      .notEmpty()
      .withMessage("Confirm password is required.")
  ];
}
module.exports = AuthValidator;

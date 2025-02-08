const express = require("express");

// Middlewares
const validationCheck = require("../middlewares/validationCheck.middleware");

// Classes
const AuthController = require("../controllers/auth.controller");
const AuthValidator = require("../validators/auth.validator");

// Router
const router = express.Router();

// Auth Routes
router.route("/login").post(AuthValidator.loginValidator, validationCheck, AuthController.login);
router
  .route("/register")
  .post(AuthValidator.validateRegisterUser, validationCheck, AuthController.register);

module.exports = router;

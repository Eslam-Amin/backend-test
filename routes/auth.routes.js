const express = require("express");

// Middlewares
const validationCheck = require("../middlewares/validationCheck.middleware");

// Classes
const AuthController = require("../controllers/auth.controller");
const GlobalValidator = require("../validators/global.validator");

// Router
const router = express.Router();

// Auth Routes
router.route("/login").post(GlobalValidator.loginValidator, validationCheck, AuthController.login);
router
  .route("/register")
  .post(GlobalValidator.validateRegisterUser, validationCheck, AuthController.register);

module.exports = router;

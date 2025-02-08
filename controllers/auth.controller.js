const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const { generateCode, hashCode } = require("../utils/generateCode");

class AuthController {
  static register = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      // Create a new user
      let user = await User.create(
        [
          {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            password: req.body.password
          }
        ],
        { session }
      );
      user = user[0];

      // Generate a verification code
      const { code, hashedCode } = await generateCode();
      user.verificationCode = hashedCode;
      // Send verification mail

      // use 'code' to be sent to the user;

      // Save hashed verification code in DB
      user.verificationCode = hashedCode;
      user.verificationCodeExp = Date.now() + 10 * 60 * 1000;
      await user.save({ session });

      await session.commitTransaction();
      return res.status(200).json({
        success: true,
        message: "Verification OTP is sent to your Email",
        data: {}
      });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  };
  // @desc    User login
  // @route   POST /auth/login
  // @access  Public
  static login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    // Check user
    let user = await User.findOne({ email: email.toLowerCase() }).select(
      "_id firstName lastName email role userType password isVerified isDeleted isBlocked"
    );
    if (!user) return next(new ApiError("Incorrect email or password", 401));
    // Check if the password is correct
    if (!(await user.comparePassword(password)))
      return next(new ApiError("Incorrect email or password", 401));
    // Check if the user is blocked
    if (user.isBlocked) {
      return next(
        new ApiError("Your account has been blocked. Please contact the super user", 403)
      );
    }
    // Response message
    let message = `Welcome back ${user.firstName}!`;
    // Check if user account is deactivated
    if (!user.isActive) {
      user = await User.findOneAndUpdate(
        { email },
        { $set: { isActive: true }, $unset: { deactivatedAt: 1 } },
        { new: true }
      );
      message = `Welcome back, ${user.firstName}! Your account has been reactivated.`;
    }
    // Check if account is verified
    if (user.isVerified !== true) {
      // Generate verification code
      // send the code to the user's email,
      // hash the code to save it in the database,
      // Send verification mail
      // And the rest of this function is ignored

      return res.status(200).json({
        success: true,
        message: "Verification code is sent to your email address"
      });
    }

    // Response user data
    const userData = { ...user.toJSON(), password: undefined };
    // generate token
    const tokenData = await user.generateToken();
    // Save the token
    user.token = tokenData.token;
    user.tokenExpDate = tokenData.tokenExpDate;
    await user.save();
    // response
    user.token = undefined;
    user.password = undefined;
    user.isVerified = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;
    // response
    res.status(200).json({
      success: true,
      message,
      data: userData,
      token: tokenData.token,
      tokenExpDate: tokenData.tokenExpDate
    });
  });
}

module.exports = AuthController;

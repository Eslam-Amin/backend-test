require("colors");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const { ADMIN, USER } = require("../utils/constants");

const createUserAndAdmin = asyncHandler(async () => {
  const admin = await User.findOne({ role: ADMIN });
  const user = await User.findOne({ role: USER });
  if (!admin) {
    const admin = new User({
      firstName: "Main",
      lastName: "Admin",
      // email: process.env.MAIN_ADMIN_EMAIL, // admin@gmail.com
      email: "user@gmail.com", // admin@gmail.com
      // password: process.env.MAIN_ADMIN_PASSWORD, // admin123
      password: "user123", // user123
      // role: ADMIN,
      role: USER,
      isVerified: true
    });
    console.log("=== Admin created successfully ===".green);
    await admin.save();
  }
  if (!user) {
    const user = new User({
      firstName: "Main",
      lastName: "User",
      email: "user@gmail.com",
      password: "user123",
      role: USER,
      isVerified: true
    });
    console.log("=== User created successfully ===".green);
    await user.save();
  }
});

module.exports = createUserAndAdmin;

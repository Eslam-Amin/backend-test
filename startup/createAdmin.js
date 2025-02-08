require("colors");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const { ADMIN } = require("../utils/constants");

const createMainAdmin = asyncHandler(async () => {
  const admin = await User.findOne({ role: ADMIN });
  if (!admin) {
    const admin = new User({
      firstName: "Main",
      lastName: "Admin",
      email: process.env.MAIN_ADMIN_EMAIL, // admin@gmail.com
      password: process.env.MAIN_ADMIN_PASSWORD, // admin123
      role: ADMIN,
      isVerified: true
    });
    console.log("=== Super admin created successfully ===".green);
    await admin.save();
  }
});

module.exports = createMainAdmin;

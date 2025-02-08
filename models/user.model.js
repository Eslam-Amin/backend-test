const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { USER, ROLES } = require("../utils/constants");

const userSchema = mongoose.Schema(
  {
    role: {
      // user, or admin
      type: String,
      trim: true,
      default: USER,
      enum: ROLES,
      required: [true, "User Role is required"]
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Email is required"]
    },
    dateOfBirth: {
      type: Date
    },
    // Password
    password: {
      type: String,
      minLength: [6, "Too short password"]
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExp: Date,
    passwordResetCodeVerified: Boolean,
    // Verification
    verificationCode: String,
    verificationCodeExp: Date,
    verificationCodeVerified: Boolean,
    isVerified: {
      type: Boolean,
      default: false
    },
    // Active
    deactivatedAt: Date,
    isActive: {
      type: Boolean,
      default: true
    },
    isBlocked: Boolean,
    token: String
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  // this to capitalize first & last name of fullName
  if (this.firstName && this.lastName)
    return (
      this.firstName.charAt(0).toUpperCase() +
      this.firstName.slice(1) +
      " " +
      this.lastName.charAt(0).toUpperCase() +
      this.lastName.slice(1)
    );
});

userSchema.virtual("age").get(function () {
  const currentDate = new Date();
  const birthDate = new Date(this.dateOfBirth);
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  // Adjust age if the birthday hasn't occurred yet this year
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())
  ) {
    return age - 1 || undefined;
  }
  return age || undefined;
});

userSchema.methods.generateToken = async function () {
  const tokenExpDate = new Date(); // Get the current date
  tokenExpDate.setDate(
    tokenExpDate.getDate() + parseInt(process.env.JWT_EXPIRATION.toString().slice(0, -1))
  );
  const token = jwt.sign(
    {
      userId: this._id,
      role: this.role,
      type: this.userType
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION
    }
  );
  // Save the generated token to the database
  this.token = token;
  // this.updatePassword = false; // to skip hashing the password
  await this.save();
  return { token, tokenExpDate };
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//runs on changing the password to change the time that password changedAt
userSchema.pre("save", async function (next) {
  if (this.firstName && this.lastName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
  }
  if (!this.isModified("password")) return next();

  //hashing Password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

module.exports = mongoose.model("User", userSchema);

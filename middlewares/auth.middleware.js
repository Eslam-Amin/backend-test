const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

// Constants
const { ADMIN, USER, ROLES } = require("../utils/constants");

// === Check user authentication and authorization function ===
const checkUser = async (Model, token, decoded, next) => {
  // Check user
  const mongooseQuery = Model.findById(decoded.userId);
  mongooseQuery.lang = decoded.lang;
  const currentUser = await mongooseQuery;
  if (!currentUser) return next(new ApiError(`${Model.modelName} not found`, 401));
  // Check if token is valid
  if (currentUser.token !== token)
    return next(new ApiError("Session expired, please login again...", 401));
  // Check if the account is deactivated
  if (currentUser.isActive === false)
    return next(new ApiError(`This ${Model.modelName} account is deactivated`, 401));
  // Check if the account is blocked
  if (currentUser.isBlocked)
    return next(new ApiError("Your account is blocked, please contact the support team", 401));
  // Check if user changed his password after token was created
  if (currentUser.passwordChangedAt) {
    const passwordChangedAtTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    if (passwordChangedAtTimestamp > decoded.iat) {
      return next(new ApiError("Password recently changed, please login again...", 401));
    }
  }

  return currentUser;
};

// === Check token => verify => Check role is valid => check expiration => check based on role ===
exports.protect = asyncHandler(async (req, res, next) => {
  // check token
  let token;
  if (req.headers.authorization) token = req.headers.authorization;
  if (!token) return next(new ApiError("Invalid token, please login again...", 401));
  // verify token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  // Check token role
  const role = decoded.role;

  if (!ROLES.includes(role))
    return next(new ApiError("Invalid token role, please login again...", 401));

  // Check token expiration
  const currentTimestamp = Math.floor(Date.now() / 1000); // in seconds
  if (decoded.exp < currentTimestamp)
    return next(new ApiError("Token has expired, please login again...", 401));
  // Check authentication and authorization
  let currentUser;
  switch (role) {
    case ADMIN:
      currentUser = await checkUser(User, token, decoded, next);
      req.role = ADMIN;
      req.userId = decoded.userId;
      break;
    case USER:
      currentUser = await checkUser(User, token, decoded, next);
      req.role = USER;
      req.userId = decoded.userId;
      break;
  }
  req.user = currentUser;
  next();
});

// === Check for user permission based on role ===
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.role))
      return next(new ApiError("Not allowed to access this route", 403));
    next();
  });

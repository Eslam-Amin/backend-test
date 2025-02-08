const path = require("path");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const ApiError = require("../utils/ApiError");
const globalError = require("../middlewares/error.middleware");

const authRoutes = require("../routes/auth.routes");
const productRoutes = require("../routes/product.routes");
module.exports = (app) => {
  // Middlewares
  app.use(cors());
  app.options("*", cors());
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  //Data Sanitization against noSql Query injection
  app.use(mongoSanitize());
  //Data Sanitization against XSS
  app.use(xss());
  //Prevent parameter pollution
  app.use(hpp());

  app.use(express.json({ limit: "25kb" }));
  app.use(express.static(path.join(__dirname, "uploads")));
  const baseURL_v1 = "/api/v1";

  app.use(`${baseURL_v1}/products`, productRoutes);
  app.use(`${baseURL_v1}/auth`, authRoutes);

  app.get("/", (req, res, next) => {
    res.status(200).json({
      status: true,
      message: "You're Server is up and running!"
    });
  });

  // Not Found Route
  app.all("*", (req, res, next) => {
    next(new ApiError(`This Route (${req.originalUrl}) is not found`, 404));
  });

  // Global Error Handler
  app.use(globalError);
};

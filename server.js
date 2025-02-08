const args = require("minimist")(process.argv.slice(2));

require("colors");
require("dotenv").config();
const express = require("express");

const createMainAdmin = require("./startup/createAdmin");

// Express app
const app = express();
const server = require("http").createServer(app);

// Port Number
const PORT = args.port || process.env.PORT || 8000;

// Startup
require("./startup/app")(app);
require("./startup/db")();

// Server
server.listen(PORT, (_) => {
  createMainAdmin();
  console.log(`🚀 ~ Server  Running on port ~ ${PORT}`.blue.bold);
});

module.exports = server;

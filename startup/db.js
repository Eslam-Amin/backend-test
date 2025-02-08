const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const PASSWORD = process.env.MONGO_PASSWORD;
const USER = process.env.MONGO_USER;
let MONGO_URI = process.env.MONGO_URI;
MONGO_URI = MONGO_URI.replace("<MONGO_PASSWORD>", PASSWORD);
MONGO_URI = MONGO_URI.replace("<MONGO_USER>", USER);

const DB = MONGO_URI;
module.exports = (_) => {
  mongoose
    .connect(DB)
    .then((conn) => {
      console.log(`Database Connected: ${conn.connection.host}`.green.bold);
    })
    .catch((err) => console.log(`Database Connected: ${err}`.red.bold));
};

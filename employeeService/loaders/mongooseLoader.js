// Set up mongoose connection
const mongoose = require("mongoose");
const config = require("../config/config");
const mongoDB = config.mongodbUri;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

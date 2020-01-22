// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  rabbitMQUrl: process.env.RABBITMQ_URL,
  mongodbUri: process.env.MONGODB_URI
};
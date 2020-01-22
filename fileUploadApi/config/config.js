// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  fileUploadDestinationFilePath: process.env.DESTINATION_FILE_PATH,
  rabbitMQUrl: process.env.RABBITMQ_URL
};
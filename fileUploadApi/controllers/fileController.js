var multer = require("multer");
const employeeService = require('../services/employeeService')
const config = require('../config/config');

// Defined storage destination and filename for the uploaded file
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.fileUploadDestinationFilePath);
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "csv";

    cb(null, "employeeData." + filetype);
  }
});

// Upload method to validate the CSV file based on file type and upload the file
exports.uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      cb(null, false);
      return cb(new Error("Only .csv format allowed!"));
    } else {
      cb(null, true);
    }
  }
});

// Upload File Callback to queue employee details
exports.uploadFileCallback = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) {
      res.status(500);
      return next(err);
    }
    await employeeService.queueEmployeeDetails(req.file.path);
    res.json({
      message: "File processing started"
    });
  } catch (error) {
    next(error);
  }
};

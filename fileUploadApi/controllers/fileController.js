var multer = require("multer");
const employee = require('../services/employeeService')
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/files");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "csv";

    cb(null, "employeeData." + filetype);
  }
});
exports.upload = multer({
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

exports.uploadFile = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) {
      res.status(500);
      return next(err);
    }
    await employee.saveEmployeeDetails(req.file.path);
    res.json({
      message: "File processing started"
    });
  } catch (error) {
    next(error);
  }
};

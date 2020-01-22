var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "image-" + Date.now() + "." + filetype);
  }
});
exports.upload = multer({ storage: storage });

exports.uploadFile = async (req, res, next) => {
  try {
    console.log(req.file);
    if (!req.file) {
      res.status(500);
      return next(err);
    }
    res.json({
      fileUrl: "http://192.168.0.7:3000/images/" + req.file.filename
    });
  } catch (error) {
    next(error);
  }
};

const multer = require("multer");
const AppError = require("../error/AppError");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "data/images");
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split(".")[1];

      cb(null, `product-${Date.now()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image! Please upload only images.", 400), false);
    }
  },
});

module.exports = upload;

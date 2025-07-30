// middleware/csvUpload.js
const multer = require("multer");
const path = require("path");

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/csv"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const csvFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.csv$/)) {
    return cb(new Error("Only .csv format allowed"), false);
  }
  cb(null, true);
};

module.exports = multer({ storage: csvStorage, fileFilter: csvFilter });
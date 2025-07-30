// utils/uploadCSV.js
// uploads/csvUpload.js
const multer = require("multer");
const path = require("path");

const csvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/csv/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const csvFilter = function (req, file, cb) {
  if (path.extname(file.originalname) === ".csv") {
    cb(null, true);
  } else {
    cb(new Error("Only .csv files are allowed"));
  }
};

const uploadCSV = multer({ storage: csvStorage, fileFilter: csvFilter });

module.exports = uploadCSV;
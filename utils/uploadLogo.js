const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../public/logos"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      req.body.teamName +
        "-" +
        file.fieldname +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const fileType = /jpg|jpeg|png|JPG|JPEG|PNG/;
  const extensionName = fileType.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = fileType.test(file.mimetype);
  if (extensionName && mimetype) {
    return cb(null, true);
  } else {
    cb("Hanya file image");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = upload;

const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "/tournamentPicture",
    allowedFormats: ["jpg", "png"],
    public_id: (req, file) => req.body.tournamentName,
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

const tournamentPicture = multer({
  storage: storage,
  limits: { fileSize: 30000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("tournamentPicture");

module.exports.tournamentPicture = tournamentPicture;

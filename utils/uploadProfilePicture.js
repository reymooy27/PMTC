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
    folder: "/profilePicture",
    allowedFormats: ["jpg", "png"],
    public_id: (req, file) => `user_${req.params.id}`,
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

const uploadProfilePicture = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("profilePicture");

module.exports.uploadProfilePicture = uploadProfilePicture;

const Participant = require("../model/participant");
const cloudinary = require("cloudinary");

module.exports = async (req, res, next) => {
  const participant = await Participant.findByIdAndDelete({
    _id: req.params.id,
  });
  if (participant) {
    cloudinary.v2.uploader.destroy(
      `logo/${participant.teamName}`,
      (error, result) => {
        console.log(result, error);
      }
    );
    res.status(200).json("Berhasil dihapus");
    next();
  } else {
    res.status(500).json("Tidak dapat dihapus");
  }
};

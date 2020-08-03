const Participant = require("../model/participant");
const cloudinary = require("cloudinary");

module.exports = async (req, res, next) => {
  const participant = await Participant.find({ confirmed: false });
  participant.forEach((p) => {
    if (Date.now() - p.registerDate > 43200000) {
      cloudinary.v2.uploader.destroy(`logo/${p.teamName}`, (error, result) => {
        console.log(result, error);
      });
      p.deleteOne((err, prod) => {
        if (err) console.log(err);
        console.log(`${prod.teamName} dihapus`);
      });
    }
  });
  next();
};

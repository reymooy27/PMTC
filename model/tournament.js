const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  tournamentName: {
    type: String,
    default: "Test",
  },
  tournamentFirstPrize: {
    type: Number,
  },
  tournamentSecondPrize: {
    type: Number,
  },
  tournamentThirdPrize: {
    type: Number,
  },
  tournamentFee: {
    type: Number,
  },
  registrationStart: {
    type: String,
  },
  startDate: {
    type: String,
  },
  qualifierDay1: {
    type: String,
  },
  qualifierDay2: {
    type: String,
  },
  grandFinalDate: {
    type: String,
  },
});

module.exports = mongoose.model("Tournament", tournamentSchema);

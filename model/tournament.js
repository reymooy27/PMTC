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
  grandFinalDate: {
    type: String,
  },
  showGroupStandings: {
    type: Boolean,
    default: false,
  },
  showGrandFinal: {
    type: Boolean,
    default: false,
  },
  showKillStanding: {
    type: Boolean,
    default: false,
  },
  registrationClosed: {
    type: Boolean,
    default: false,
  },
  teams:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }]
});

module.exports = mongoose.model("Tournament", tournamentSchema);

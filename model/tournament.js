const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  tournamentName: {
    type: String,
    default: "Test",
    required: true
  },
  tournamentFirstPrize: {
    type: Number,
    required: true
  },
  tournamentSecondPrize: {
    type: Number,
    required: true

  },
  tournamentThirdPrize: {
    type: Number,
    required: true

  },
  tournamentFee: {
    type: Number,
    required: true

  },
  registrationStart: {
    type: String,
    required: true

  },
  startDate: {
    type: String,
    required: true

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
    ref: 'Team'
  }]
});

module.exports = mongoose.model("Tournament", tournamentSchema);

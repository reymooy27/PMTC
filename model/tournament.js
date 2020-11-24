const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  tournamentName: {
    type: String,
    default: "Test",
    required: true
  },
  tournamentMode:{
    type:String,
    required: true
  },
  tournamentFormat:{
    type: String,
    required: true
  },
  tournamentPicture:{
    type: String,
    required: false,
    default:'https://res.cloudinary.com/dzrpmwbhx/image/upload/v1604060952/default/unnamed_1_rllz4y.jpg'
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
  registrationEnd: {
    type: Date,
    required: true

  },
  startDate: {
    type: Date,
    required: true

  },
  maxSlot:{
    type: Number,
    required: true
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
  completed:{
    type: Boolean,
    default: false
  },
  teams:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
  rounds:[{
    round:{
      type: String,
    },
    time:{
      type: Date
    },
    match:{
      type: Number
    },
    map:{
      type: String
    }
  }],
  groups:{
    type: Number,
    default: 4
  }
});

module.exports = mongoose.model("Tournament", tournamentSchema);

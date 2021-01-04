const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  game:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
  },
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
  description:{
    type:String,
    default: ''
  },
  information:{
    type: String,
    default: ''
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
  status:{
    type: String,
    default: 'OPEN'
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
  },
  // admins:[{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }]
  admins:[{
    name:{
      type:String
    },
    whatsapp:{
      type: Number
    }
  }]
});

module.exports = mongoose.model("Tournament", tournamentSchema);

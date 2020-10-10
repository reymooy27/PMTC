const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  singkatanTeam: {
    type: String,
    required: true,
    maxlength: 5,
  },
  teamKillPoint: {
    type: Number,
    default: 0,
  },
  GFteamKillPoint: {
    type: Number,
    default: 0,
  },
  teamPlcPoint: {
    type: Number,
    default: 0,
  },
  GFteamPlcPoint: {
    type: Number,
    default: 0,
  },
  logo: {
    type: String,
    required: false,
  },
  idPlayer: {
    type: Number,
    required: true,
  },
  playerName: {
    type: String,
    required: true,
    maxlength: 15,
  },
  playerKill: {
    type: Number,
    default: 0,
  },
  GFplayerKill: {
    type: Number,
    default: 0,
  },

  idPlayer2: {
    type: Number,
    required: true,
  },
  playerName2: {
    type: String,
    required: true,
    maxlength: 15,
  },
  player2Kill: {
    type: Number,
    default: 0,
  },
  GFplayer2Kill: {
    type: Number,
    default: 0,
  },

  idPlayer3: {
    type: Number,
    required: true,
  },
  playerName3: {
    type: String,
    required: true,
    maxlength: 15,
  },
  player3Kill: {
    type: Number,
    default: 0,
  },
  GFplayer3Kill: {
    type: Number,
    default: 0,
  },

  idPlayer4: {
    type: Number,
    required: true,
  },
  playerName4: {
    type: String,
    required: true,
    maxlength: 15,
  },
  player4Kill: {
    type: Number,
    default: 0,
  },
  GFplayer4Kill: {
    type: Number,
    default: 0,
  },
  idPlayer5: {
    type: Number,
    required: false,
  },
  playerName5: {
    type: String,
    required: false,
    maxlength: 15,
  },
  player5Kill: {
    type: Number,
    default: 0,
  },
  GFplayer5Kill: {
    type: Number,
    default: 0,
  },

  handphoneNumber: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  qualifyToGrandFinal: {
    type: Boolean,
  },
  inGroup: {
    type: String,
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
  tournamentFirstWinner: {
    type: Boolean,
    default: false,
  },
  tournamentSecondWinner: {
    type: Boolean,
    default: false,
  },
  tournamentThirdWinner: {
    type: Boolean,
    default: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  inTournament:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }
});

module.exports = mongoose.model("Participant", userSchema);

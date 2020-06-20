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
    type: Buffer,
    required: false,
  },
  logoType: {
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
});

userSchema.virtual("logoImagePath").get(function () {
  if (this.logo != null && this.logoType != null) {
    return `data:${this.logoType};charset=utf-8;base64,${this.logo.toString(
      "base64"
    )}`;
  }
});

module.exports = mongoose.model("Participant", userSchema);
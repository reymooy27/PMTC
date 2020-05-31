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
  idPlayer2: {
    type: Number,
    required: true,
  },
  idPlayer3: {
    type: Number,
    required: true,
  },
  idPlayer4: {
    type: Number,
    required: true,
  },

  playerName: {
    type: String,
    required: true,
    maxlength: 15,
  },
  playerName2: {
    type: String,
    required: true,
    maxlength: 15,
  },

  playerName3: {
    type: String,
    required: true,
    maxlength: 15,
  },

  playerName4: {
    type: String,
    required: true,
    maxlength: 15,
  },

  handphoneNumber: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
    required: true,
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

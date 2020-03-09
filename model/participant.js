const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true
  },
  singkatanTeam: {
    type: String,
    required: true,
    maxlength: 5
  },
  logo: {
    required: false
  },

  idPlayer: {
    type: Number,
    required: true
  },
  idPlayer2: {
    type: Number,
    required: true
  },
  idPlayer3: {
    type: Number,
    required: true
  },
  idPlayer4: {
    type: Number,
    required: true
  },

  playerName: {
    type: String,
    required: true,
    maxlength: 15
  },
  playerName2: {
    type: String,
    required: true,
    maxlength: 15
  },

  playerName3: {
    type: String,
    required: true,
    maxlength: 15
  },

  playerName4: {
    type: String,
    required: true,
    maxlength: 15
  },

  handphoneNumber: {
    type: Number,
    required: true
  },

  email: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Participant", userSchema);
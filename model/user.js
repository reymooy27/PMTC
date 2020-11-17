const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true
  },
  profilePicture:{
    type: String,
    required: false
  },
  myTeam:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team2'
  }],
  inTeam:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team2'
  }],
  friends:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  inTournaments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }],
  pubgMobileID:{
    type: Number,
    required: false
  },
  role:{
    type: String,
    default: 'USER'
  }
});

module.exports = mongoose.model("User", user);

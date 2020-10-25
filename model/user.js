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
    ref: 'Team'
  }],
  pubgMobileID:{
    type: Number,
    required: false
  }
});

module.exports = mongoose.model("User", user);

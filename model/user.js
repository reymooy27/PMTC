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
    default: null
  },
  myTeam:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team2'
  }],
  friends:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tournaments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }],
  inTournaments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }],
  role:{
    type: String,
    default: 'USER'
  },
  bio:{
    type: String,
      default: ''
  },
  socialMedia:{
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    youtube: {
      type: String,
      default: ''
    }
  },
  birthDate:{
    type: Date,
    default: ''
  },
  pubgMobileStats:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PUBGMobileStats'
  },
  verified:{
    type: Boolean,
    default: false
  },
  facebook: {
    id: {
      type: String,
      default: ''
    },
    token: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
  },
  google: {
    email_verified:{
      type:Boolean,
      default: false
    },
    email: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
  },
  
});

module.exports = mongoose.model("User", user);

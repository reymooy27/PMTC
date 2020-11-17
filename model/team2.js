const mongoose = require('mongoose');

const team2 = new mongoose.Schema({
  teamName:{
    type: String,
    required: true
  },
  teamLogo:{
    type: String,
    required: false
  },
  roster: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  inTournaments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }],
})

module.exports = mongoose.model('Team2',team2);
const mongoose = require('mongoose');

const team2 = new mongoose.Schema({
  teamName:{
    type: String,
    required: true
  },
  teamLogo:{
    type: String,
    required: false,
    // default: 
  },
  createdAt:{
    type: Date,
    default: Date.now()
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  roster: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  inTournaments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  }],
  tournamentStatistic:[{
    type: String,
    default: null
  }]
})

module.exports = mongoose.model('Team2',team2);
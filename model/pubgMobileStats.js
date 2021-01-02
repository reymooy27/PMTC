const mongoose = require('mongoose')

const pubgMobileStats = new mongoose.Schema({
  userID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nickInGamePUBGMobile:{
    type: String,
    required: true
  },
  idInGamePUBGMobile:{
    type: String,
    required: true
  },
  totalMatchPlayed:{
    type: Number,
    default: 0
  },
  totalKill:{
    type: Number,
    default: 0
  },
  totalDamage:{
    type: Number,
    default: 0
  },
  killPerDeath:{
    type: Number,
    default: 0
  },
  totalAssist:{
    type: Number,
    default: 0
  },
  winRate:{
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('PUBGMobileStats', pubgMobileStats)
const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  message:{
    type: String,
    default: ''
  },
  sender:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  recievers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  read_by:[{
    readerId:{
      type:mongoose.Schema.Types.ObjectId, 
      ref:'User'
    },
    read_at: {
      type: Date, 
      default: Date.now
    }
  }],
},{
  timestamps:{
    createdAt: true,
    updatedAt: true
  }
})

module.exports = mongoose.model('Notification', notificationSchema)
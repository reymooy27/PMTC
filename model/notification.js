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
  link: {
    type: String,
    default: '/'
  },
  action:[{
    actionType: {
      type: String
    },
    actionLink:{
      type: String
    }
  }]
},{
  timestamps:{
    createdAt: true,
    updatedAt: true
  }
})

module.exports = mongoose.model('Notification', notificationSchema)
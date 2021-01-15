const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  conversation: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'Conversations',
    },
  message: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },
  to:{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    }
  },
{
  timestamps:{
    createdAt: true,
    updatedAt: false
  }
})
module.exports = mongoose.model('Chat',chatSchema)
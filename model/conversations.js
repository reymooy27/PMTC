const mongoose = require('mongoose')

const conversationsSchema = new mongoose.Schema({
  recipients: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],
    lastMessage: {
        type: String,
    },
},{
  timestamps:{
    createdAt: true,
    updatedAt: false
  }
}
)

module.exports = mongoose.model('Conversations', conversationsSchema)
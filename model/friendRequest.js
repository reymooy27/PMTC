const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  from: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  to:{
    type:  mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  accepted:{
    type: Boolean,
    default: false
  },
  pending:{
    type: Boolean,
    default: true
  }
},{
  timestamps:{
    createdAt: true,
    updatedAt: true
  }
}
)

module.exports = mongoose.model('FriendRequest', friendRequestSchema)
const FR = require('../model/friendRequest')
const User = require('../model/user')

const sendFriendRequest = async (req,res)=>{
  try {
    const request = await FR.findOne({
      $or: [
          { $and: [{ to: req.user._id }, { from: req.params.id }] },
          { $and: [{ to: req.params.id }, { from: req.user._id }] },
      ],
        })
    if(request) return res.status(400).json('Permintaan anda sudah terkirim')

    const newRequest = new FR({
      from: req.user._id,
      to: req.params.id
    })
    newRequest.save()
    req.io.sockets.emit('sendFriendRequest', newRequest._id)
    res.status(200).json('Berhasil mengirim permintaan pertemanan')
  } catch (error) {
    res.status(400).json('Gagal mengirim permintaan pertemanan')
  }
}

const updateFriendRequest = async (req,res)=>{
  try {
    const request = await FR.findById({_id: req.params.id})
    request.accepted = req.body.accepted
    request.pending = false
    request.save()
    if(request.accepted === true){
      const user = await User.findById({_id: request.from})
      user.friends.push(request.to)
      user.save()
      const friends = await User.findById({_id: request.to})
      friends.friends.push(request.from)
      friends.save()
      req.io.sockets.emit('updateFriendRequest', request._id)
      return res.status(200).json('Permintaan pertemanan anda diterima')
    }else{
      req.io.sockets.emit('updateFriendRequest', request._id)
      return res.status(200).json('Permintaan pertemanan anda ditolak')
    }
  } catch (error) {
    res.status(400).json('Gagal mengudate permintaan pertemanan')
  }
}

const getFriendRequests = async (req,res)=>{
  try {
    const requests = await FR.find({
      $or: [
          { $and: [{ from: req.user._id}]},
          { $and: [{ to: req.user._id }]},
      ],
    })
    .populate({
        path: 'from',
        model: 'User',
        select: { '_id': 1,'username':1, 'profilePicture': 1},
      })
      .populate({
        path: 'to',
        model: 'User',
        select: { '_id': 1,'username':1, 'profilePicture': 1},
      })
    res.status(200).json(requests)
  } catch (error) {
    res.status(400).json('Gagal mendapatkan permintaan pertemanan')
  }
}

module.exports = {
  sendFriendRequest,
  updateFriendRequest,
  getFriendRequests
}
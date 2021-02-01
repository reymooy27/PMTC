const FR = require('../model/friendRequest')
const User = require('../model/user')
const Notification = require('../model/notification')

const sendFriendRequest = async (req,res)=>{
  try {
    const request = await FR.findOne({
      $or: [
          { $and: [{ to: req.user._id }, { from: req.params.id }, {requestType: 'FRIEND_REQUEST'}] },
          { $and: [{ to: req.params.id }, { from: req.user._id }, {requestType: 'FRIEND_REQUEST'}] },
      ],
        })
    if(request) return res.status(400).json('Permintaan anda sudah terkirim')

    const newRequest = new FR({
      from: req.user._id,
      to: req.params.id,
      requestType: 'FRIEND_REQUEST'
    })
    newRequest.save()
    req.io.sockets.emit('sendFriendRequest', newRequest._id)
    const newNotification = new Notification({
      sender: req.user._id,
      message: 'Anda memiliki permintaan pertemanan baru',
      recievers: [req.params.id],
      link: `/profile/${req.user._id}`,
      action: [
        {
          actionType: 'Terima',
          actionLink: `/friendRequest/update/${newRequest._id}`
        },
        {
          actionType: 'Tolak',
          actionLink: `/friendRequest/update/${newRequest._id}`
        },
    ]
    })
    newNotification.save()
    req.io.sockets.emit('notification', newNotification._id)
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
    const notif = await Notification.findOne({$and: [{sender: request.from}, {recievers: [req.user._id]},{message: 'Anda memiliki permintaan pertemanan baru'}]})
    if(request.accepted === true){
      notif.remove()
      const user = await User.findById({_id: request.from})
      user.friends.push(request.to )
      user.save()
      const friends = await User.findById({_id: request.to})
      friends.friends.push(request.from)
      friends.save()
      req.io.sockets.emit('friendRequest', request._id)
      const newNotification = new Notification({
        sender: request.to,
        message: 'Permintaan pertemanan anda diterima',
        recievers: [request.from],
        link: `/profile/${request.to}`
      })
      newNotification.save()
      req.io.sockets.emit('notification', newNotification._id)
      return res.status(200).json('Permintaan pertemanan anda diterima')
    }else{
      notif.remove()
      request.remove()
      req.io.sockets.emit('notification', 'Permintaan pertemanan anda ditolak')
      return res.status(200).json('Permintaan pertemanan anda ditolak')
    }
  } catch (error) {
    res.status(400).json('Gagal mengudate permintaan pertemanan')
  }
}

const cancelFriendRequest = async (req,res)=>{
  try {
    const requests = await FR.findOne({$and:[{from: req.user._id},{to: req.params.id},{requestType: 'FRIEND_REQUEST'}]})
    const notif = await Notification.findOne({$and: [{sender: req.user._id}, {recievers: [req.params.id]}]})
    notif.remove()
    requests.remove()
    req.io.sockets.emit('notification', 'Berhasil membatalkan permintaan pertemanan')
    res.status(200).json('Berhasil membatalkan permintaan pertemanan')
  } catch (error) {
    res.status(400).json('Gagal membatalkan permintaan pertemanan')
  }
}

const getFriendRequests = async (req,res)=>{
  try {
    const requests = await FR.findOne({$and:[{from: req.user._id}, {to: req.params.id}, {requestType: 'FRIEND_REQUEST'}]})
    req.io.sockets.emit('notification', 'Berhasil mendapatkan permintaan pertemanan')
    res.status(200).json(requests)
  } catch (error) {
    res.status(400).json('Gagal mendapatkan permintaan pertemanan')
  }
}

module.exports = {
  sendFriendRequest,
  updateFriendRequest,
  cancelFriendRequest,
  getFriendRequests
}
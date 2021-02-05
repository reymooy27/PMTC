const Notificaton = require('../model/notification')

const getNotifications = async (req,res)=> {
  try {
    const notifications = await Notificaton.find({
      recievers: {
        $all: [req.user._id]
      },
  })
  .populate({
    path: 'sender',
    model: 'User',
    select:{'_id': 1, 'username': 1, 'profilePicture': 1}
  })
  .sort({'createdAt': -1})
  .lean()
    res.status(200).json(notifications)
  } catch (error) {
    res.status(400).json('Gagal mendapatkan notifikasi')
  }

}

module.exports = {
  getNotifications
}
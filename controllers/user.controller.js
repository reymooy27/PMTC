const User = require("../model/user");
const FR = require('../model/friendRequest')

const getAllUser = async (req,res)=>{
  try {
    const users = await User.find().sort({username: 1}).lean().select('username profilePicture').exec()
    res.status(200).json(users)
  } catch (error) {
    res.status(400).json('Pemain yang anda cari tidak ada')
  }
}

const getUserByID = async (req,res)=>{
  try {
    const user = await User.findById({ _id: req.params.id })
    .select('-password -facebook -google')
    .populate('pubgMobileStats')
    .populate('myTeam')
    .populate('inTournaments')
    .populate('tournaments')
    .populate({
      path: 'friends',
      model: 'User',
      select: { '_id': 1,'username':1, 'profilePicture': 1},
    })
    .exec()
    res.json(user);
  } catch (error) {
    res.status(404).json('User yang anda cari tidak ada')
  }
}

const updateProfilePicture = async (req,res)=>{
  const user = await User.findById({_id: req.params.id})
  const picturePath = req.file != null ? req.file.path : null;
  try {
    if(user){
    user.profilePicture = picturePath
    await user.save()
    res.status(200).json('Berhasil mengupload gambar')
    }
  } catch (error) {
    res.status(400).json('Gagal mengupload gambar')
  }
}

const updateUserProfile = async (req,res)=>{
  const user = await User.findById({_id: req.params.id})
  try {
    if(user){
    user.set(req.body)
    await user.save()
    return res.status(200).json('Berhasil mengupdate profil anda')
    }
  } catch (error) {
    res.status(400).json('Gagal mengupdate profil anda')
  }
}

const unFriend = async (req,res)=>{
  try {
    await User.updateOne({_id: req.user._id},{'$pull': {'friends': req.params.id}})
    await User.updateOne({_id: req.params.id},{'$pull': {'friends': req.user._id}})
    const requests = await FR.findOne({
      $or:[
        { $and:[{from: req.user._id},{to: req.params.id}]},
        { $and:[{from: req.params.id},{to: req.user._id}]},
      ]})
    requests.remove()
    req.io.sockets.emit('unFriend', 'Berhasil membatalkan pertemanan')
    res.status(200).json('Berhasil membatalkan pertemanan')
  } catch (error) {
    res.status(400).json('Gagal membatalkan pertemanan')
  }
}

module.exports = {
  getAllUser,
  getUserByID,
  updateProfilePicture,
  updateUserProfile,
  unFriend
}
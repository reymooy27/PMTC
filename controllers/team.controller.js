const Team = require("../model/team");
const cloudinary = require("cloudinary");
const { registerValidation } = require("../utils/validation");
const sendEmail = require("../utils/sendEmail");
const Tournament = require("../model/tournament");
const Team2 = require("../model/team2");
const User = require("../model/user");
const FR = require('../model/friendRequest')
const Notification = require('../model/notification')


const getTeam2ByID = async (req,res)=>{
  try {
  const team = await Team2.findById({ _id: req.params.id }).lean().populate({
    path:'roster',
    select:'_id username profilePicture'
  });
    res.json(team);
  } catch (error) {
    res.status(404).json('Team yang anda cari tidak ada')
    
  }
}


const createUserTeam = async (req, res)=>{
  const teamExist = await Team2.findOne({teamName: req.body.teamName})
  if(teamExist) return res.status(400).json('Nama tim sudah terpakai')

  const team = new Team2({
    teamName: req.body.teamName,
    createdBy: req.user._id
  });

  try {
    const user = await User.findByIdAndUpdate({_id: req.params.id},{$push: {myTeam: team},},{new: true, upsert:true })
    team.roster.push(user)
    await team.save()
    res.status(200).json('Berhasil membuat team')
  } catch (error) {
    res.status(400).json('Tidak bisa membuat team')
  }
}

const deleteUserTeam = async (req,res)=>{
  try {
    const team = await Team2.findById({
    _id: req.params.teamId,
  });
  if (team) {
    cloudinary.v2.uploader.destroy(
      `logo/${team.teamName}-${team.inTournament}`,
      (error, result) => {
      if(error){
        throw error
      }
      }
    );
    await User.updateMany({'myTeam' : team._id}, {'$pull':{'myTeam' : team._id}})
    await Tournament.updateOne({'teams': team._id},{'$pull':{'teams':team._id}})
    team.remove()
    res.status(200).json('Berhasil menghapus team')
  }
  } catch (error) {
    res.status(400).json('Tidak bisa menghapus team')
  }
}


const removePlayerFromTeam = async (req,res)=>{
  try {
    await Team2.updateOne({'roster': req.params.userID}, {'$pull': {'roster': req.params.userID}})
    await User.updateOne({'myTeam': req.params.teamID}, {'$pull': {'myTeam': req.params.teamID}})
    req.io.sockets.emit('removePlayer', 'Berhasil mengeluarkan pemain dari tim')
    res.status(200).json('Berhasil mengeluarkan pemain dari tim')
  } catch (error) {
    res.status(400).json('Gagal mengeluarkan pemain dari tim')
  }
}

const teamInvite = async (req,res)=>{
  try {
    const request = await FR.findOne({
      $or: [
          { $and: [{ to: req.user._id }, { from: req.params.id },{requestType: 'TEAM_INVITATION'}] },
          { $and: [{ to: req.params.id }, { from: req.user._id },{requestType: 'TEAM_INVITATION'}] },
      ],
        })
    if(request) return res.status(400).json('Undangan anda sudah terkirim')

    const team = await Team2.findOne({'roster': req.params.id})
    if(team) return res.status(400).json('Pemain sudah berada dalam tim')

    const newRequest = new FR({
      from: req.user._id,
      to: req.params.id,
      requestType: 'TEAM_INVITATION',
      teamId: req.body.teamId
    })
    newRequest.save()
    req.io.sockets.emit('sendTeamInvitation', newRequest._id)
    const newNotification = new Notification({
      sender: req.user._id,
      message: 'Anda memiliki undangan tim baru',
      recievers: [req.params.id],
      link: `/profile/team/${req.body.teamId}`,
      action: [
        {
          actionType: 'Terima',
          actionLink: `/team/invite/update/${newRequest._id}`
        },
        {
          actionType: 'Tolak',
          actionLink: `/team/invite/update/${newRequest._id}`
        },
    ]
    })
    newNotification.save()
    req.io.sockets.emit('notification', newNotification._id)
    res.status(200).json('Berhasil mengirim undangan tim')
  } catch (error) {
    res.status(400).json('Gagal mengirim undangan tim')
  }
}

const updateTeamInvite = async (req,res)=>{
  try {
    const request = await FR.findById({_id: req.params.id})
    const notif = await Notification.findOne({$and: [{sender: request.from}, {recievers: [req.user._id]},{message: 'Anda memiliki undangan tim baru'}]})
    if(req.body.accepted === true){
      const team = await Team2.findById({_id: request.teamId })
      team.roster.push(request.to)
      team.save()
      const user = await User.findById({_id: request.to})
      user.myTeam.push(team)
      user.save()
      req.io.sockets.emit('sendTeamInvitation', request._id)
      const newNotification = new Notification({
        sender: request.to,
        message: 'Undangan tim anda diterima',
        recievers: [request.from],
        link: `/profile/team/${request.teamId}`
      })
      newNotification.save()
      notif.remove()
      request.remove()
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

const cancelTeamInvite = async (req,res)=>{
  try {
    const requests = await FR.findOne({$and:[{from: req.user._id},{to: req.params.id},{requestType: 'TEAM_INVITATION'}]})
    const notif = await Notification.findOne({$and: [{sender: req.user._id}, {recievers: [req.params.id]},{message: 'Anda memiliki undangan tim baru'}]})
    notif.remove()
    requests.remove()
    req.io.sockets.emit('notification', 'Berhasil membatalkan undangan tim')
    res.status(200).json('Berhasil membatalkan undangan tim')
  } catch (error) {
    res.status(400).json('Gagal membatalkan undangan tim')
  }
}

module.exports = {
  getTeam2ByID,
  createUserTeam,
  deleteUserTeam,
  teamInvite,
  updateTeamInvite,
  cancelTeamInvite,
  removePlayerFromTeam,
  
};

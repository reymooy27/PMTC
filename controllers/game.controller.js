const Game = require('../model/game')
const User = require("../model/user");
const PUBGMobileStats = require('../model/pubgMobileStats')


const getAllGame = async (req,res)=>{
  try {
    const game = await Game.find().lean()
    res.status(200).json(game)
  } catch (error) {
    res.status(400).json('Game yang anda cari tidak ada')
  }
}

const getGame = async (req,res)=>{
  const game = await Game.findById({_id: req.params.id})
  try {
    res.status(200).json(game)
  } catch (error) {
    res.status(400).json('Game yang anda cari tidak ada')
  }
}

const addNewGame = async (req,res)=>{
  const gameExist = await Game.findOne({gameName: req.body.gameName})
  if(gameExist) return res.status(400).json('Game sudah ditambahkan')

  const game = new Game(req.body)
  try {
    await game.save()
    res.status(200).json('Berhasil menambahkan game')
  } catch (error) {
    res.status(400).json('Gagal menambahkan game baru')
  }
}

const addAccountPUBGMobile = async (req,res)=>{
  try {
    const user = await User.findById({_id: req.params.id})
    if(user.pubgMobileStats != null) return res.status(400).json('PUBG Mobile sudah ditambahkan')
    const pubgmStats = new PUBGMobileStats({
      nickInGamePUBGMobile: req.body.nickInGamePUBGMobile,
      idInGamePUBGMobile: req.body.idInGamePUBGMobile,
      userID: user._id
    })
    await pubgmStats.save()
    user.set({pubgMobileStats: pubgmStats})
    await user.save()
    res.status(200).json('Berhasil menambahkan akun game')
  } catch (error) {
    res.status(400).json('Gagal menambahkan akun game')
  }
}

const updateUserPubgMobileStats = async (req,res)=>{
  try {
    const stats = await PUBGMobileStats.findOne({userID: req.params.id})
    if(!stats) return res.status(404).json('User belum memiliki statistik')
    stats.set(req.body)
    await stats.save()
    res.status(200).json('Berhasil memperbarui statistik')
  } catch (error) {
    res.status(400).json('Gagal memperbarui statistik')
  }
}
module.exports = {
  getAllGame,
  getGame,
  addNewGame,
  addAccountPUBGMobile,
  updateUserPubgMobileStats
}

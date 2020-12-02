const Game = require('../model/game')

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

module.exports = {getAllGame,getGame,addNewGame}

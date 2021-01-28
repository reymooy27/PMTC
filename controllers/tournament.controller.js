const Team = require("../model/team");
const Tournament = require("../model/tournament");
const cloudinary = require("cloudinary");
const User = require("../model/user");
const Team2 = require("../model/team2");


const createTournament = async (req, res) => {
const user = await User.findById({_id: req.user._id})
  if(user.role !== 'ADMIN') return res.status(400).json('Tidak memiliki akses')

  const tournamentPicturePath = req.file != null ? req.file.path : 'https://res.cloudinary.com/dzrpmwbhx/image/upload/v1604060952/default/unnamed_1_rllz4y.jpg';

  const tournament = new Tournament({
    tournamentName: req.body.tournamentName,
    tournamentMode: req.body.tournamentMode,
    tournamentFormat: req.body.tournamentFormat,
    tournamentPicture: tournamentPicturePath,
    tournamentFirstPrize: req.body.tournamentFirstPrize,
    tournamentSecondPrize: req.body.tournamentSecondPrize,
    tournamentThirdPrize: req.body.tournamentThirdPrize,
    tournamentFee: req.body.tournamentFee,
    registrationEnd: req.body.registrationEnd,
    startDate: req.body.startDate,
    maxSlot: req.body.maxSlot,
    rounds: JSON.parse(req.body.rounds),
    groups: req.body.groups
  });

  try {
    await tournament.save();
    req.io.sockets.emit('createTournament', 'Turnamen dibuat')
    res.status(200).json('Berhasil membuat turnamen')
  } catch (error) {
    res.status(400).json('Tidak bisa membuat turnamen')
  }
};

const updateTournament = async (req, res) => {
  const user = await User.findById({_id: req.user._id})
  if(user.role !== 'ADMIN') return res.status(400).json('Tidak memiliki akses')

  const turnamen = await Tournament.findById({_id: req.params.id})
  try {
    turnamen.set(req.body)
    turnamen.save()
    req.io.sockets.emit('updateTournament', 'Turnamen diupdate')
    res.status(200).json('Berhasil mengupdate')
  } catch (error) {
    res.status(400).json('Gagal mengupdate')
  }
  
};

const deleteTournament = async (req, res)=>{
  const user = await User.findById({_id: req.user._id})
  if(user.role !== 'ADMIN') return res.status(400).json('Tidak memiliki akses')
  
  try {
    const tournament = await Tournament.findById({_id: req.params.id})
    if(tournament){
      cloudinary.v2.uploader.destroy(
        `tournamentPicture/${tournament.tournamentName}`,
        (error, result) => {
          if(error){
            throw error
          }
        }
      );
      await Team.updateOne({'inTournament': tournament._id},{'$set':{'inTournament': null}},{overwrite: true})
      tournament.remove()
      req.io.sockets.emit('deleteTournament', 'Turnamen dihapus')  
      res.status(200).json('Berhasil menghapus turnamen')
    }
  } catch (error) {
    res.status(400).json('Gagal menghapus turnamen')
  }
}

const getAllTournament = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
    .select('tournamentName tournamentPicture tournamentFirstPrize tournamentSecondPrize tournamentThirdPrize startDate tournamentMode teams maxSlot status')
    .sort({startDate: -1})
    .lean()
    res.json(tournaments)
  } catch (error) {
    res.status(404).json('Tournament yang anda cari tidak ada')
  }
}

const getTournamentByID = async (req,res)=>{
  try {
    const tournament = await Tournament.findById({ _id: req.params.id })
    .populate('teams')
    .lean()
    .exec()
    res.json(tournament)
  } catch (error) {
    res.status(404).json('Tournament yang anda cari tidak ada')
  }
}

const joinTournament = async (req,res)=>{
  try {
    const promisetournament = Tournament.findById({_id: req.params.idTournament})
    const promiseteamRoster = Team2.findById({_id: req.params.teamId})
    const [tournament, teamRoster] = await Promise.all([promisetournament, promiseteamRoster])

    if(tournament.teams.includes(req.params.teamId)) return res.status(400).json('Tim sudah terdaftar dalam turnamen')
    if(teamRoster.roster.length < 4) return res.status(400).json('Tim ini tidak memiliki cukup pemain')

    await Tournament.updateOne({_id: req.params.idTournament},{'$push':{'teams':req.params.teamId}})
    await Team2.updateOne({_id: req.params.teamId},{'$push':{'inTournaments':req.params.idTournament}})
    await User.updateMany({'myTeam': req.params.teamId}, {'$push':{'inTournaments': req.params.idTournament}})
    res.status(200).json('Berhasil menambahkan ke turnamen')
  } catch (error) {
    res.status(400).json('Gagal menambahkan ke turnamen')
  }
}

module.exports = {
  createTournament,
  updateTournament,
  deleteTournament,
  getAllTournament,
  getTournamentByID,
  joinTournament
};

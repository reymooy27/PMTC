const Team = require("../model/team");
const Tournament = require("../model/tournament");
const cloudinary = require("cloudinary");
const User = require("../model/user");


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
    res.status(200).json('Berhasil membuat turnamen')
  } catch (error) {
    res.status(400).json('Tidak bisa membuat turnamen')
  }
};

const updateTournament = async (req, res) => {
  const user = await User.findById({_id: req.user._id})
  if(user.role !== 'ADMIN') return res.status(400).json('Tidak memiliki akses')

  const {
tournamentName,
tournamentMode,
tournamentFormat,
tournamentFirstPrize,
tournamentSecondPrize,
tournamentThirdPrize,
tournamentFee,
registrationEnd,
startDate,
maxSlot,
showGroupStandings,
showGrandFinal,
showKillStanding,
registrationClosed,
completed,rounds,
        groups} = req.body

  try {
    await Tournament.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        tournamentName,
        tournamentMode,
        tournamentFormat,
        tournamentFirstPrize,
        tournamentSecondPrize,
        tournamentThirdPrize,
        tournamentFee,
        registrationEnd,
        startDate,
        maxSlot,
        showGroupStandings,
        showGrandFinal,
        showKillStanding,
        registrationClosed,
        completed,
        rounds,
        groups
      },
    },
    { runValidators: true });
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
      res.status(200).json('Berhasil menghapus turnamen')
    }
  } catch (error) {
    res.status(400).json('Gagal menghapus turnamen')
  }
}

const getAllTournament = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
    .select('tournamentName tournamentPicture tournamentFirstPrize tournamentSecondPrize tournamentThirdPrize startDate tournamentMode teams maxSlot completed')
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

module.exports = {
  createTournament,
  updateTournament,
  deleteTournament,
  getAllTournament,
  getTournamentByID
};

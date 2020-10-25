const Tournament = require("../model/tournament");

const createTournament = async (req, res) => {
  const {tournamentName,
tournamentFirstPrize,
tournamentSecondPrize,
tournamentThirdPrize,
tournamentFee,
registrationStart,
startDate,
grandFinalDate} = req.body
  const tournament = new Tournament({
    tournamentName,
    tournamentFirstPrize,
    tournamentSecondPrize,
    tournamentThirdPrize,
    tournamentFee,
    registrationStart,
    startDate,
    grandFinalDate,
  });

  try {
    const savedTournament = await tournament.save();
  } catch (error) {
    res.status(400).json('Tidak bisa membuat turnamen')
  }
};

const updateTournament = async (req, res) => {
  const {tournamentName,
tournamentFirstPrize,
tournamentSecondPrize,
tournamentThirdPrize,
tournamentFee,
registrationStart,
startDate,
grandFinalDate,
showGroupStandings,
showGrandFinal,
showKillStanding,
registrationClosed} = req.body

  await Tournament.findByIdAndUpdate(
    { _id: "5ef4596040d71032dc8bc81d" },
    {
      $set: {
        tournamentName,
        tournamentFirstPrize,
        tournamentSecondPrize,
        tournamentThirdPrize,
        tournamentFee,
        registrationStart,
        startDate,
        grandFinalDate,
        showGroupStandings,
        showGrandFinal,
        showKillStanding,
        registrationClosed,
      },
    },
    { runValidators: true },
    (err, response) => {
      if (err) {
        res.status(500).json("Tidak dapat update");
      } else {
        res.status(200).json("Update berhasil");
      }
    }
  );
};

const getAllTournament = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
    res.json(tournaments)
  } catch (error) {
    res.status(404).json('Tournament yang anda cari tidak ada')
  }
 
}

const getTournamentByID = async (req,res)=>{
  try {
    const tournament = await Tournament.findById({ _id: req.params.id }).populate('teams').exec()
    res.json(tournament)
  } catch (error) {
    res.status(404).json('Tournament yang anda cari tidak ada')
  }
}

module.exports = {
  createTournament,
  updateTournament,
  getAllTournament,
  getTournamentByID
};

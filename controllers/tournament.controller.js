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
    console.log(error);
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
  await Tournament.find().then((tourney) => {
    res.json(tourney);
  });
}

module.exports = {
  createTournament,
  updateTournament,
  getAllTournament
};

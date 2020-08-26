const Tournament = require("../model/tournament");

const createTournament = async (req, res) => {
  const tournament = new Tournament({
    tournamentName: req.body.tournamentName,
    tournamentFirstPrize: req.body.tournamentFirstPrize,
    tournamentSecondPrize: req.body.tournamentSecondPrize,
    tournamentThirdPrize: req.body.tournamentThirdPrize,
    tournamentFee: req.body.tournamentFee,
    registrationStart: req.body.registrationStart,
    startDate: req.body.startDate,
    qualifierDay1: req.body.qualifierDay1,
    qualifierDay2: req.body.qualifierDay2,
    grandFinalDate: req.body.grandFinalDate,
  });

  try {
    const savedTournament = await tournament.save();
  } catch (error) {
    console.log(error);
  }
};

const updateTournament = async (req, res) => {
  await Tournament.findByIdAndUpdate(
    { _id: "5ef4596040d71032dc8bc81d" },
    {
      $set: {
        tournamentName: req.body.tournamentName,
        tournamentFirstPrize: req.body.tournamentFirstPrize,
        tournamentSecondPrize: req.body.tournamentSecondPrize,
        tournamentThirdPrize: req.body.tournamentThirdPrize,
        tournamentFee: req.body.tournamentFee,
        registrationStart: req.body.registrationStart,
        startDate: req.body.startDate,
        qualifierDay1: req.body.qualifierDay1,
        qualifierDay2: req.body.qualifierDay2,
        grandFinalDate: req.body.grandFinalDate,
        showGroupStandings: req.body.showGroupStandings,
        showGrandFinal: req.body.showGrandFinal,
        showKillStanding: req.body.showKillStanding,
        registrationClosed: req.body.registrationClosed,
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

module.exports = {
  createTournament,
  updateTournament,
};

const router = require("express").Router();
const Tournament = require("../model/tournament");
const tournamentCtrl = require("../controllers/tournament.controller");

// api
router.get("/api/v1/tourney", async (req, res) => {
  await Tournament.find().then((tourney) => {
    res.json(tourney);
  });
});

// create tournament
router.post("/tournament", tournamentCtrl.createTournament);

// update tournament
router.put("/tournament", tournamentCtrl.updateTournament);

module.exports = router;

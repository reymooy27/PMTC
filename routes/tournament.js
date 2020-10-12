const router = require("express").Router();
const tournamentCtrl = require("../controllers/tournament.controller");

router.post("/api/v1/tournaments", tournamentCtrl.getAllTournament);
router.post('/tournament/:id', async (req,res)=>{
  const tournament = await Tournament.findById({ _id: req.params.id }).populate('teams')
  res.json(tournament)
})
router.post("/tournament", tournamentCtrl.createTournament);
router.put("/tournament", tournamentCtrl.updateTournament);

module.exports = router;

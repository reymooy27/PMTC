const router = require("express").Router();
const tournamentCtrl = require("../controllers/tournament.controller");

router.post("/api/v1/tournaments", tournamentCtrl.getAllTournament);
router.post('/tournament/:id', tournamentCtrl.getTournamentByID)
router.post("/tournament/create", tournamentCtrl.createTournament);
router.put("/tournament/update", tournamentCtrl.updateTournament);

module.exports = router;

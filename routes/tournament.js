const router = require("express").Router();
const tournamentCtrl = require("../controllers/tournament.controller");

router.post("/tournament/create", tournamentCtrl.createTournament);
router.put("/tournament/:id/update", tournamentCtrl.updateTournament);
router.post("/api/v1/tournaments", tournamentCtrl.getAllTournament);
router.post('/tournament/:id', tournamentCtrl.getTournamentByID)

module.exports = router;

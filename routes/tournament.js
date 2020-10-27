const router = require("express").Router();
const tournamentCtrl = require("../controllers/tournament.controller");
const verify = require('../utils/verifyToken');

router.post("/tournament/create", verify, tournamentCtrl.createTournament);
router.put("/tournament/:id/update", verify, tournamentCtrl.updateTournament);
router.post("/api/v1/tournaments", tournamentCtrl.getAllTournament);
router.post('/tournament/:id', tournamentCtrl.getTournamentByID)

module.exports = router;

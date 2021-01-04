const router = require("express").Router();
const tournamentCtrl = require("../controllers/tournament.controller");
const verify = require('../utils/verifyToken');
const {tournamentPicture} = require('../utils/tournamentPicture')

router.post("/tournament/create", verify, tournamentPicture, tournamentCtrl.createTournament);
router.patch("/tournament/:id/update", verify, tournamentCtrl.updateTournament);
router.delete("/tournament/:id/delete", verify, tournamentCtrl.deleteTournament);
router.post("/api/v1/tournaments", tournamentCtrl.getAllTournament);
router.post('/tournament/:id', tournamentCtrl.getTournamentByID)

module.exports = router;

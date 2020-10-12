const router = require("express").Router();
const { upload } = require("../utils/uploadLogo");
const participantCtrl = require("../controllers/participant.controller");

router.post("/api/v1/teams", participantCtrl.getAllTeam);
router.post("/registration", upload, participantCtrl.createParticipant);
router.post("/participant/:id",participantCtrl.getTeamByID);
router.put("/participant/:id", participantCtrl.updateParticipant);
router.delete("/participant/:id", participantCtrl.deleteParticipant);

module.exports = router;

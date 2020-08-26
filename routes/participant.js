const express = require("express");
const router = express.Router();
const Participant = require("../model/participant");
const { upload } = require("../utils/uploadLogo");
const participantCtrl = require("../controllers/participant.controller");
//api
router.get("/api/v1/register", async (req, res) => {
  await Participant.find().then((participants) => {
    res.json(participants);
  });
});

// registration/create new participant
router.post("/registration", upload, participantCtrl.createParticipant);

router.get("/participant/:id", async (req, res) => {
  const participant = await Participant.findById({ _id: req.params.id });
  if (participant) {
    res.json(participant);
  }
});

// update participant
router.put("/participant/:id", participantCtrl.updateParticipant);
// delete participant
router.delete("/participant/:id", participantCtrl.deleteParticipant);

module.exports = router;

const router = require("express").Router();
const Participant = require("../model/participant");
const {
  registerValidation
} = require("../validation");
const express = require("express");
const app = express();
const urlencoded = app.use(
  express.urlencoded({
    extended: false
  })
);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

router.get("/registration", async (req, res) => {
  const teamNameExist = await Participant.findOne({
    teamName: req.body.teamName
  });
  if (teamNameExist) return res.status(400).send("Nama Tim sudah terdaftar");

  Participant.find().then(participants => {

    res.render("registration", {
      jumlahParticipant: participants.length,
      participant: participants
    });
  });
});

router.post("/registration", urlencoded, async (req, res) => {
  //validation
  const {
    error
  } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the prticipant already exist
  const teamNameExist = await Participant.findOne({
    teamName: req.body.teamName
  });
  if (teamNameExist) return res.status(400).send("Nama Tim sudah terdaftar");

  const idPlayerExist = await Participant.findOne({
    idPlayer: req.body.idPlayer
  });
  if (idPlayerExist) return res.status(400).send("ID Player 1 sudah terdaftar");

  const idPlayerExist2 = await Participant.findOne({
    idPlayer2: req.body.idPlayer2
  });
  if (idPlayerExist2) return res.status(400).send("ID Player 2 sudah terdaftar");

  const idPlayerExist3 = await Participant.findOne({
    idPlayer3: req.body.idPlayer3
  });
  if (idPlayerExist3) return res.status(400).send("ID Player 3 sudah terdaftar");

  const idPlayerExist4 = await Participant.findOne({
    idPlayer4: req.body.idPlayer4
  });
  if (idPlayerExist4) return res.status(400).send("ID Player 4 sudah terdaftar");

  const handphoneNumberExist = await Participant.findOne({
    handphoneNumber: req.body.handphoneNumber
  });
  if (handphoneNumberExist)
    return res.status(400).send("Nomor HP sudah terdaftar");

  const emailExist = await Participant.findOne({
    email: req.body.email
  });
  if (emailExist) return res.status(400).send("Email sudah terdaftar");

  //create a new user
  const participant = new Participant({
    teamName: req.body.teamName,
    singkatanTeam: req.body.singkatanTeam,
    idPlayer: req.body.idPlayer,
    idPlayer2: req.body.idPlayer2,
    idPlayer3: req.body.idPlayer3,
    idPlayer4: req.body.idPlayer4,
    playerName: req.body.playerName,
    playerName2: req.body.playerName2,
    playerName3: req.body.playerName3,
    playerName4: req.body.playerName4,
    handphoneNumber: req.body.handphoneNumber,
    email: req.body.email
  });

  saveLogo(participant, req.body.logo);

  try {
    const savedParticipant = await participant.save();
    res.redirect("/");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", (req, res) => {
  Participant.find().then(participants => {
    res.render("index", {
      jumlahParticipant: participants.length,
      participant: participants
    });
  });
});

router.get("/register", (req, res) => {
  Participant.find().then(participants => {
    const a = participants;

    res.json(a);
  });
});

function saveLogo(image, logoEncoded) {
  if (logoEncoded == null) return;
  const logo = JSON.parse(logoEncoded);
  if (logo != null && imageMimeTypes.includes(logo.type)) {
    image.logo = new Buffer.from(logo.data, 'base64');
    image.logoType = logo.type
  }
}

module.exports = router;
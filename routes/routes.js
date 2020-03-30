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

router.get("/registration", (req, res) => {
  res.render("registration");
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
  if (idPlayerExist) return res.status(400).send("ID sudah terdaftar");

  const idPlayerExist2 = await Participant.findOne({
    idPlayer2: req.body.idPlayer2
  });
  if (idPlayerExist2) return res.status(400).send("ID sudah terdaftar");

  const idPlayerExist3 = await Participant.findOne({
    idPlayer3: req.body.idPlayer3
  });
  if (idPlayerExist3) return res.status(400).send("ID sudah terdaftar");

  const idPlayerExist4 = await Participant.findOne({
    idPlayer4: req.body.idPlayer4
  });
  if (idPlayerExist4) return res.status(400).send("ID sudah terdaftar");

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
    logo: req.body.logo,
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

  res.redirect("/");

  try {
    const savedParticipant = await participant.save();
    res.send(savedParticipant);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", (req, res) => {
  Participant.find().then(participants => {
    // const page = req.query.page;
    // const limit = req.query.limit;

    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;

    // const resultParty = participants.slice(startIndex, endIndex);
    // console.log(resultParty);

    res.render("index", {
      jumlahParticipant: participants.length,
      participant: participants
    });
  });
});



router.get("/participant/:id", (req, res) => {
  res.send(`${req.params.id}`);
});

router.get("/register", (req, res) => {
  Participant.find().then(participants => {
    const a = participants;

    res.json(a);
  });
});

module.exports = router;
const router = require("express").Router();
const Participant = require("../model/participant");
const User = require("../model/user");
const { registerValidation } = require("../validation");
const express = require("express");
const dotenv = require("dotenv");
const midtransClient = require("midtrans-client");
const bcrypt = require("bcrypt");

const app = express();
const urlencoded = app.use(
  express.urlencoded({
    extended: true,
  })
);

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const batasPeserta = 64;

router.get("/", (req, res) => {
  Participant.find().then((participants) => {
    res.render("index", {
      jumlahParticipant: participants.length,
      participant: participants,
      batasPeserta: batasPeserta,
    });
  });
});

router.get("/registration", async (req, res) => {
  Participant.find().then((participants) => {
    res.render("registration", {
      jumlahParticipant: participants.length,
      participant: participants,
      batasPeserta: batasPeserta,
      body: req.body,
    });
  });
});

router.get("/register", (req, res) => {
  Participant.find().then((participants) => {
    const a = participants;

    res.json(a);
  });
});

router.get("/simple_checkout", function (req, res) {
  // initialize snap client object
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });
  let parameter = {
    transaction_details: {
      order_id: "order-id-node-" + Math.round(new Date().getTime() / 1000),
      gross_amount: 100000,
    },
    customer_details: {
      first_name: req.body.teamName,
      email: req.body.email,
      phone: req.body.handphoneNumber,
    },
    credit_card: {
      secure: true,
    },
    expiry: {
      unit: "hour",
      duration: 12,
    },
  };

  snap.createTransactionToken(parameter).then((transactionToken) => {
    res.render("simple_checkout", {
      token: transactionToken,
      clientKey: snap.apiConfig.clientKey,
    });
  });
});

router.get("/admin", (req, res) => {
  Participant.find().then((participants) => {
    res.render("admin", {
      participant: participants,
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/registration", urlencoded, async (req, res) => {
  //validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the prticipant already exist
  const teamNameExist = await Participant.findOne({
    teamName: req.body.teamName,
  });
  if (teamNameExist) return res.status(400).send("Nama Tim sudah terdaftar");

  const idPlayerExist = await Participant.findOne({
    idPlayer: req.body.idPlayer,
  });
  if (idPlayerExist) return res.status(400).send("ID Player 1 sudah terdaftar");

  const idPlayerExist2 = await Participant.findOne({
    idPlayer2: req.body.idPlayer2,
  });
  if (idPlayerExist2)
    return res.status(400).send("ID Player 2 sudah terdaftar");

  const idPlayerExist3 = await Participant.findOne({
    idPlayer3: req.body.idPlayer3,
  });
  if (idPlayerExist3)
    return res.status(400).send("ID Player 3 sudah terdaftar");

  const idPlayerExist4 = await Participant.findOne({
    idPlayer4: req.body.idPlayer4,
  });
  if (idPlayerExist4)
    return res.status(400).send("ID Player 4 sudah terdaftar");

  const handphoneNumberExist = await Participant.findOne({
    handphoneNumber: req.body.handphoneNumber,
  });
  if (handphoneNumberExist)
    return res.status(400).send("Nomor HP sudah terdaftar");

  const emailExist = await Participant.findOne({
    email: req.body.email,
  });
  if (emailExist) return res.status(400).send("Email sudah terdaftar");

  if (
    req.body.idPlayer === req.body.idPlayer2 ||
    req.body.idPlayer === req.body.idPlayer3 ||
    req.body.idPlayer === req.body.idPlayer4
  ) {
    return res.status(400).send("ID Player 1 sudah terdaftar");
  }
  if (
    req.body.idPlayer2 === req.body.idPlayer ||
    req.body.idPlayer2 === req.body.idPlayer3 ||
    req.body.idPlayer2 === req.body.idPlayer4
  ) {
    return res.status(400).send("ID Player 2 sudah terdaftar");
  }
  if (
    req.body.idPlayer3 === req.body.idPlayer ||
    req.body.idPlayer3 === req.body.idPlayer2 ||
    req.body.idPlayer3 === req.body.idPlayer4
  ) {
    return res.status(400).send("ID Player 3 sudah terdaftar");
  }
  if (
    req.body.idPlayer4 === req.body.idPlayer ||
    req.body.idPlayer4 === req.body.idPlayer2 ||
    req.body.idPlayer4 === req.body.idPlayer3
  ) {
    return res.status(400).send("ID Player 4 sudah terdaftar");
  }

  //create a new user
  const participant = new Participant({
    teamName: req.body.teamName,
    singkatanTeam: req.body.singkatanTeam.toUpperCase(),
    idPlayer: req.body.idPlayer,
    idPlayer2: req.body.idPlayer2,
    idPlayer3: req.body.idPlayer3,
    idPlayer4: req.body.idPlayer4,
    playerName: req.body.playerName,
    playerName2: req.body.playerName2,
    playerName3: req.body.playerName3,
    playerName4: req.body.playerName4,
    handphoneNumber: req.body.handphoneNumber,
    email: req.body.email,
  });
  if (req.body.logo !== "") {
    saveLogo(participant, req.body.logo);
  }

  // res.redirect("/simple_checkout");

  try {
    const savedParticipant = await participant.save();
    res.redirect("/");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/signup", async (req, res) => {
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
    });

    try {
      const savedUser = await user.save();
      res.json({
        status: "Success",
        msg: "Berhasil menyimpan data",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });
});

router.post("/login", urlencoded, async (req, res) => {
  const checkUsername = await User.findOne({ username: req.body.username });
  if (!checkUsername) return res.status(400).json({ msg: "Username Salah" });

  bcrypt.compare(req.body.password, checkUsername.password, (err, result) => {
    if (!result) return res.status(400).json({ msg: "Password Salah" });
    res.redirect("/admin");
  });
});

router.put("/:id", (req, res) => {
  Participant.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        teamKillPoint:
          Number(req.body.playerKill) +
          Number(req.body.player2Kill) +
          Number(req.body.player3Kill) +
          Number(req.body.player4Kill),
        teamPlcPoint: req.body.teamPlcPoint,
        playerKill: req.body.playerKill,
        player2Kill: req.body.player2Kill,
        player3Kill: req.body.player3Kill,
        player4Kill: req.body.player4Kill,
        inGroup: req.body.inGroup,
        qualifyToGrandFinal: req.body.qualifyToGrandFinal,
        GFteamKillPoint:
          Number(req.body.GFplayerKill) +
          Number(req.body.GFplayer2Kill) +
          Number(req.body.GFplayer3Kill) +
          Number(req.body.GFplayer4Kill),
        GFteamPlcPoint: req.body.GFteamPlcPoint,
        GFplayerKill: req.body.GFplayerKill,
        GFplayer2Kill: req.body.GFplayer2Kill,
        GFplayer3Kill: req.body.GFplayer3Kill,
        GFplayer4Kill: req.body.GFplayer4Kill,
      },
    },
    { runValidators: true },
    (err, response) => {
      if (err) {
        res.status(500).json("Tidak dapat update");
      } else {
        res.status(200).json("Update berhasil");
      }
    }
  );
});

function saveLogo(image, logoEncoded) {
  if (logoEncoded == null) return;
  const logo = JSON.parse(logoEncoded);
  if (logo != null && imageMimeTypes.includes(logo.type)) {
    image.logo = new Buffer.from(logo.data, "base64");
    image.logoType = logo.type;
  }
}

module.exports = router;

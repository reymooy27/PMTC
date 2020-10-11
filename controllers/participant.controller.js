const Participant = require("../model/participant");
const cloudinary = require("cloudinary");
const { registerValidation } = require("../utils/validation");
const sendEmail = require("../utils/sendEmail");

const createParticipant = async (req, res) => {
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
    req.body.idPlayer === req.body.idPlayer4 ||
    req.body.idPlayer === req.body.idPlayer5
  ) {
    return res.status(400).send("ID Player 1 sudah terdaftar");
  }
  if (
    req.body.idPlayer2 === req.body.idPlayer ||
    req.body.idPlayer2 === req.body.idPlayer3 ||
    req.body.idPlayer2 === req.body.idPlayer4 ||
    req.body.idPlayer2 === req.body.idPlayer5
  ) {
    return res.status(400).send("ID Player 2 sudah terdaftar");
  }
  if (
    req.body.idPlayer3 === req.body.idPlayer ||
    req.body.idPlayer3 === req.body.idPlayer2 ||
    req.body.idPlayer3 === req.body.idPlayer4 ||
    req.body.idPlayer3 === req.body.idPlayer5
  ) {
    return res.status(400).send("ID Player 3 sudah terdaftar");
  }
  if (
    req.body.idPlayer4 === req.body.idPlayer ||
    req.body.idPlayer4 === req.body.idPlayer2 ||
    req.body.idPlayer4 === req.body.idPlayer3 ||
    req.body.idPlayer4 === req.body.idPlayer5
  ) {
    return res.status(400).send("ID Player 4 sudah terdaftar");
  }
  if (
    req.body.idPlayer5 === req.body.idPlayer ||
    req.body.idPlayer5 === req.body.idPlayer2 ||
    req.body.idPlayer5 === req.body.idPlayer3 ||
    req.body.idPlayer5 === req.body.idPlayer4
  ) {
    return res.status(400).send("ID Player 5 sudah terdaftar");
  }

  //create a new participant
  const logoPath = req.file != null ? req.file.path : null;
  const participant = new Participant({
    teamName: req.body.teamName,
    singkatanTeam: req.body.singkatanTeam.toUpperCase(),
    logo: logoPath,
    idPlayer: req.body.idPlayer,
    idPlayer2: req.body.idPlayer2,
    idPlayer3: req.body.idPlayer3,
    idPlayer4: req.body.idPlayer4,
    idPlayer5: req.body.idPlayer5,
    playerName: req.body.playerName,
    playerName2: req.body.playerName2,
    playerName3: req.body.playerName3,
    playerName4: req.body.playerName4,
    playerName5: req.body.playerName5,
    handphoneNumber: req.body.handphoneNumber,
    email: req.body.email,
  });

  try {
    const savedParticipant = await participant.save();
    sendEmail(req.body.email, req.body.teamName);
    res.redirect("https://pubgm-terminator-challenge.web.app/registration/email-confirmation");
  } catch (err) {
    res.status(400).send(err);
  }
};

const deleteParticipant = async (req, res, next) => {
  const participant = await Participant.findByIdAndDelete({
    _id: req.params.id,
  });
  if (participant) {
    cloudinary.v2.uploader.destroy(
      `logo/${participant.teamName}`,
      (error, result) => {
        console.log(result, error);
      }
    );
    res.status(200).json("Berhasil dihapus");
    next();
  } else {
    res.status(500).json("Tidak dapat dihapus");
  }
};

const updateParticipant = async (req, res) => {
  await Participant.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        teamKillPoint:
          Number(req.body.playerKill) +
          Number(req.body.player2Kill) +
          Number(req.body.player3Kill) +
          Number(req.body.player4Kill) +
          Number(req.body.player5Kill),
        teamPlcPoint: req.body.teamPlcPoint,
        playerKill: req.body.playerKill,
        player2Kill: req.body.player2Kill,
        player3Kill: req.body.player3Kill,
        player4Kill: req.body.player4Kill,
        player5Kill: req.body.player5Kill,
        inGroup: req.body.inGroup,
        qualifyToGrandFinal: req.body.qualifyToGrandFinal,
        GFteamKillPoint:
          Number(req.body.GFplayerKill) +
          Number(req.body.GFplayer2Kill) +
          Number(req.body.GFplayer3Kill) +
          Number(req.body.GFplayer4Kill) +
          Number(req.body.GFplayer5Kill),
        GFteamPlcPoint: req.body.GFteamPlcPoint,
        GFplayerKill: req.body.GFplayerKill,
        GFplayer2Kill: req.body.GFplayer2Kill,
        GFplayer3Kill: req.body.GFplayer3Kill,
        GFplayer4Kill: req.body.GFplayer4Kill,
        GFplayer5Kill: req.body.GFplayer5Kill,
        tournamentFirstWinner: req.body.tournamentFirstWinner,
        tournamentSecondWinner: req.body.tournamentSecondWinner,
        tournamentThirdWinner: req.body.tournamentThirdWinner,
        confirmed: req.body.confirmed,
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
};

module.exports = {
  createParticipant,
  updateParticipant,
  deleteParticipant,
};

const Team = require("../model/team");
const cloudinary = require("cloudinary");
const { registerValidation } = require("../utils/validation");
const sendEmail = require("../utils/sendEmail");
const Tournament = require("../model/tournament");

const createTeam = async (req, res) => {
  const {teamName,singkatanTeam,
idPlayer,
idPlayer2,
idPlayer3,
idPlayer4,
idPlayer5,
playerName,
playerName2,
playerName3,
playerName4,
playerName5,
handphoneNumber,
email } = req.body
  //validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the prticipant already exist
  const teamNameExist = await Team.findOne({
    teamName,
  });
  if (teamNameExist) return res.status(400).send("Nama Tim sudah terdaftar");

  const idPlayerExist = await Team.findOne({
    idPlayer,
  });
  if (idPlayerExist) return res.status(400).send("ID Player 1 sudah terdaftar");

  const idPlayerExist2 = await Team.findOne({
    idPlayer2,
  });
  if (idPlayerExist2)
    return res.status(400).send("ID Player 2 sudah terdaftar");

  const idPlayerExist3 = await Team.findOne({
    idPlayer3,
  });
  if (idPlayerExist3)
    return res.status(400).send("ID Player 3 sudah terdaftar");

  const idPlayerExist4 = await Team.findOne({
    idPlayer4,
  });
  if (idPlayerExist4)
    return res.status(400).send("ID Player 4 sudah terdaftar");

  const handphoneNumberExist = await Team.findOne({
    handphoneNumber,
  });
  if (handphoneNumberExist)
    return res.status(400).send("Nomor HP sudah terdaftar");

  const emailExist = await Team.findOne({
    email,
  });
  if (emailExist) return res.status(400).send("Email sudah terdaftar");

  if (
    idPlayer === idPlayer2 ||
    idPlayer === idPlayer3 ||
    idPlayer === idPlayer4 ||
    idPlayer === idPlayer5
  ) {
    return res.status(400).send("ID Player 1 sudah terdaftar");
  }
  if (
    idPlayer2 === idPlayer ||
    idPlayer2 === idPlayer3 ||
    idPlayer2 === idPlayer4 ||
    idPlayer2 === idPlayer5
  ) {
    return res.status(400).send("ID Player 2 sudah terdaftar");
  }
  if (
    idPlayer3 === idPlayer ||
    idPlayer3 === idPlayer2 ||
    idPlayer3 === idPlayer4 ||
    idPlayer3 === idPlayer5
  ) {
    return res.status(400).send("ID Player 3 sudah terdaftar");
  }
  if (
    idPlayer4 === idPlayer ||
    idPlayer4 === idPlayer2 ||
    idPlayer4 === idPlayer3 ||
    idPlayer4 === idPlayer5
  ) {
    return res.status(400).send("ID Player 4 sudah terdaftar");
  }
  if (
    idPlayer5 === idPlayer ||
    idPlayer5 === idPlayer2 ||
    idPlayer5 === idPlayer3 ||
    idPlayer5 === idPlayer4
  ) {
    return res.status(400).send("ID Player 5 sudah terdaftar");
  }

  //create a new Team
  const logoPath = req.file != null ? req.file.path : null;
  const team = new Team({
    teamName,
    singkatanTeam: singkatanTeam.toUpperCase(),
    logo: logoPath,
    idPlayer,
    idPlayer2,
    idPlayer3,
    idPlayer4,
    idPlayer5,
    playerName,
    playerName2,
    playerName3,
    playerName4,
    playerName5,
    handphoneNumber,
    email,
    inTournament: '5ef4596040d71032dc8bc81d'
  });

  try {
    const savedTeam = await team.save();
    const teamByTournament = await Tournament.findById('5ef4596040d71032dc8bc81d')
    teamByTournament.teams.push(team)
    await teamByTournament.save()
    sendEmail(email, teamName);
    res.redirect("https://pubgm-terminator-challenge.web.app/registration/email-confirmation");
  } catch (err) {
    res.status(400).send(err);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndDelete({
    _id: req.params.id,
  });
  if (team) {
    cloudinary.v2.uploader.destroy(
      `logo/${team.teamName}`,
      (error, result) => {
       if(error){
         throw error
       }
      }
    );
    await Tournament.updateOne({'teams': req.params.id},{'$pull':{'teams':req.params.id}})
    res.status(200).json("Berhasil dihapus");
    next();
  }
  } catch (error) {
    res.status(500).json("Tidak dapat dihapus");
  }
};

const updateTeam = async (req, res) => {
  const { 
playerKill,
player2Kill,
player3Kill,
player4Kill,
player5Kill,teamPlcPoint,inGroup,qualifyToGrandFinal,GFplayerKill,
GFplayer2Kill,
GFplayer3Kill,
GFplayer4Kill,
GFplayer5Kill,
GFteamPlcPoint,tournamentFirstWinner,
tournamentSecondWinner,
tournamentThirdWinner,
confirmed} = req.body

try{
  await Team.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        teamKillPoint:
          Number(playerKill) +
          Number(player2Kill) +
          Number(player3Kill) +
          Number(player4Kill) +
          Number(player5Kill),
        teamPlcPoint,
        playerKill,
        player2Kill,
        player3Kill,
        player4Kill,
        player5Kill,
        inGroup,
        qualifyToGrandFinal,
        GFteamKillPoint:
          Number(GFplayerKill) +
          Number(GFplayer2Kill) +
          Number(GFplayer3Kill) +
          Number(GFplayer4Kill) +
          Number(GFplayer5Kill),
        GFteamPlcPoint,
        GFplayerKill,
        GFplayer2Kill,
        GFplayer3Kill,
        GFplayer4Kill,
        GFplayer5Kill,
        tournamentFirstWinner,
        tournamentSecondWinner,
        tournamentThirdWinner,
        confirmed,
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
}
catch(err){
  res.status(500).json("Tidak dapat update");
}
};

const getAllTeam = async (req, res) => {
  try {
    const teams =  await Team.find()
      res.json(teams);
  } catch (error) {
    res.status(404).json('Team yang anda cari tidak ada')
  }
  
}

const getTeamByID = async (req,res)=>{
  try {
   const team = await Team.findById({ _id: req.params.id });
    res.json(team);
  } catch (error) {
    res.status(404).json('Team yang anda cari tidak ada')
    
  }
}

module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  getAllTeam,
  getTeamByID,
};

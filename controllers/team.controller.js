const Team = require("../model/team");
const cloudinary = require("cloudinary");
const { registerValidation } = require("../utils/validation");
const sendEmail = require("../utils/sendEmail");
const Tournament = require("../model/tournament");
const Team2 = require("../model/team2");
const User = require("../model/user");

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
  if (error) return res.status(400).json(error.details[0].message);

  const teams = await Team.find({inTournament: req.params.id});

  const checkTeamName = teams.map(t=>{
    if( teamName === t.teamName){
      return true
    }
  })
  if(checkTeamName.includes(true)) return res.status(400).json('Nama Tim sudah terdaftar')

  const checkPlayer1 = teams.map(t=>{
    if( idPlayer === t.idPlayer ||
        idPlayer === t.idPlayer2 ||
        idPlayer === t.idPlayer3 ||
        idPlayer === t.idPlayer4 ||
        idPlayer === t.idPlayer5){
          return true
        }
  })
  if(checkPlayer1.includes(true)) return res.status(400).json('ID Player 1 sudah terdaftar')

  const checkPlayer2 = teams.map(t=>{
    if( idPlayer2 === t.idPlayer ||
        idPlayer2 === t.idPlayer2 ||
        idPlayer2 === t.idPlayer3 ||
        idPlayer2 === t.idPlayer4 ||
        idPlayer2 === t.idPlayer5){
          return true
        }
  })
  if(checkPlayer2.includes(true)) return res.status(400).json('ID Player 2 sudah terdaftar')

  const checkPlayer3 = teams.map(t=>{
    if( idPlayer3 === t.idPlayer ||
        idPlayer3 === t.idPlayer2 ||
        idPlayer3 === t.idPlayer3 ||
        idPlayer3 === t.idPlayer4 ||
        idPlayer3 === t.idPlayer5){
          return true
        }
  })
  if(checkPlayer3.includes(true)) return res.status(400).json('ID Player 3 sudah terdaftar')

  const checkPlayer4 = teams.map(t=>{
    if( idPlayer4 === t.idPlayer ||
        idPlayer4 === t.idPlayer2 ||
        idPlayer4 === t.idPlayer3 ||
        idPlayer4 === t.idPlayer4 ||
        idPlayer4 === t.idPlayer5){
          return true
        }
  })
  if(checkPlayer4.includes(true)) return res.status(400).json('ID Player 4 sudah terdaftar')

  if (
    idPlayer === idPlayer2 ||
    idPlayer === idPlayer3 ||
    idPlayer === idPlayer4 ||
    idPlayer === idPlayer5
  ) {
    return res.status(400).json("ID Player 1 sama");
  }
  if (
    idPlayer2 === idPlayer ||
    idPlayer2 === idPlayer3 ||
    idPlayer2 === idPlayer4 ||
    idPlayer2 === idPlayer5
  ) {
    return res.status(400).json("ID Player 2 sama");
  }
  if (
    idPlayer3 === idPlayer ||
    idPlayer3 === idPlayer2 ||
    idPlayer3 === idPlayer4 ||
    idPlayer3 === idPlayer5
  ) {
    return res.status(400).json("ID Player 3 sama");
  }
  if (
    idPlayer4 === idPlayer ||
    idPlayer4 === idPlayer2 ||
    idPlayer4 === idPlayer3 ||
    idPlayer4 === idPlayer5
  ) {
    return res.status(400).json("ID Player 4 sama");
  }
  if (
    idPlayer5 === idPlayer ||
    idPlayer5 === idPlayer2 ||
    idPlayer5 === idPlayer3 ||
    idPlayer5 === idPlayer4
  ) {
    return res.status(400).json("ID Player 5 sama");
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
    inTournament: req.params.id
  });

  try {
    const savedTeam = await team.save();
    const teamByTournament = await Tournament.findById(req.params.id)
    teamByTournament.teams.push(team)
    await teamByTournament.save()
    sendEmail(email, teamName,teamByTournament.tournamentFee );
    res.json('Berhasil mendaftar')
  } catch (error) {
    res.status(400).json('Gagal mendaftar');
  }
};

const deleteTeam = async (req, res, next) => {
  const user = await User.findById({_id: req.user._id})
  if(user.role !== 'ADMIN') return res.status(400).json('Tidak memiliki akses')

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
    await Tournament.updateOne({'teams': team._id},{'$pull':{'teams':team._id}})
    res.status(200).json("Berhasil dihapus");
    next();
  }
  } catch (error) {
    res.status(500).json("Gagal dihapus");
  }
};

const updateTeam = async (req, res) => {
  const user = await User.findById({_id: req.user._id})
  if(user.role !== 'ADMIN') return res.status(400).json('Tidak memiliki akses')

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
    { runValidators: true });
    res.status(200).json("Update berhasil");
}
catch(error){
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

const getTeam2ByID = async (req,res)=>{
  try {
   const team = await Team2.findById({ _id: req.params.id });
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
  getTeam2ByID
};

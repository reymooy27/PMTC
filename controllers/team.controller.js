const Team = require("../model/team");
const cloudinary = require("cloudinary");
const { registerValidation } = require("../utils/validation");
const sendEmail = require("../utils/sendEmail");
const Tournament = require("../model/tournament");
const Team2 = require("../model/team2");
const User = require("../model/user");

const createTeam = async (req, res) => {
  const {teamName,
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
    if( Number(idPlayer) === Number(t.idPlayer) ||
        Number(idPlayer) === Number(t.idPlayer2) ||
        Number(idPlayer) === Number(t.idPlayer3) ||
        Number(idPlayer) === Number(t.idPlayer4) ||
        Number(idPlayer)=== Number(t.idPlayer5)){
          return true
        }
  })
  if(checkPlayer1.includes(true)) return res.status(400).json('ID Player 1 sudah terdaftar')

  const checkPlayer2 = teams.map(t=>{
    if( Number(idPlayer2) === Number(t.idPlayer) ||
        Number(idPlayer2) === Number(t.idPlayer2) ||
        Number(idPlayer2) === Number(t.idPlayer3) ||
        Number(idPlayer2) === Number(t.idPlayer4) ||
        Number(idPlayer2) === Number(t.idPlayer5)){
          return true
        }
  })
  if(checkPlayer2.includes(true)) return res.status(400).json('ID Player 2 sudah terdaftar')

  const checkPlayer3 = teams.map(t=>{
    if( Number(idPlayer3) === Number(t.idPlayer) ||
        Number(idPlayer3) === Number(t.idPlayer2) ||
        Number(idPlayer3) === Number(t.idPlayer3) ||
        Number(idPlayer3) === Number(t.idPlayer4) ||
        Number(idPlayer3) === Number(t.idPlayer5)){
          return true
        }
  })
  if(checkPlayer3.includes(true)) return res.status(400).json('ID Player 3 sudah terdaftar')

  const checkPlayer4 = teams.map(t=>{
    if( Number(idPlayer4) === Number(t.idPlayer) ||
        Number(idPlayer4) === Number(t.idPlayer2) ||
        Number(idPlayer4) === Number(t.idPlayer3) ||
        Number(idPlayer4) === Number(t.idPlayer4) ||
        Number(idPlayer4) === Number(t.idPlayer5)){
          return true
        }
  })
  if(checkPlayer4.includes(true)) return res.status(400).json('ID Player 4 sudah terdaftar')

  if (
    Number(idPlayer)=== Number(idPlayer2) ||
    Number(idPlayer)=== Number(idPlayer3) ||
    Number(idPlayer)=== Number(idPlayer4) ||
    Number(idPlayer)=== Number(idPlayer5)
  ) {
    return res.status(400).json("ID Player 1 sama");
  }
  if (
    Number(idPlayer2) === Number(idPlayer) ||
    Number(idPlayer2) === Number(idPlayer3) ||
    Number(idPlayer2) === Number(idPlayer4) ||
    Number(idPlayer2) === Number(idPlayer5)
  ) {
    return res.status(400).json("ID Player 2 sama");
  }
  if (
    Number(idPlayer3) === Number(idPlayer) ||
    Number(idPlayer3) === Number(idPlayer2) ||
    Number(idPlayer3) === Number(idPlayer4) ||
    Number(idPlayer3) === Number(idPlayer5)
  ) {
    return res.status(400).json("ID Player 3 sama");
  }
  if (
    Number(idPlayer4) === Number(idPlayer) ||
    Number(idPlayer4) === Number(idPlayer2) ||
    Number(idPlayer4) === Number(idPlayer3) ||
    Number(idPlayer4) === Number(idPlayer5)
  ) {
    return res.status(400).json("ID Player 4 sama");
  }
  if (
    Number(idPlayer5) === Number(idPlayer) ||
    Number(idPlayer5) === Number(idPlayer2) ||
    Number(idPlayer5) === idPlayer3 ||
    Number(idPlayer5) === Number(idPlayer4)
  ) {
    return res.status(400).json("ID Player 5 sama");
  }

  //create a new Team
  const logoPath = req.file != null ? req.file.path : null;
  const team = new Team({
    teamName,
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
    req.io.sockets.emit('registTournament', 'Daftar turnamen')
    res.status(200).json('Berhasil mendaftar')
  } catch (error) {
    res.status(400).json('Gagal mendaftar');
  }
};

const deleteTeam = async (req, res, next) => {
  const user = await User.findById({_id: req.user._id})
  if(user.role !== 'ADMIN') return res.status(400).json('Tidak memiliki akses')

  try {
    const team = await Team.findById({
    _id: req.params.id,
  });
  if (team) {
    cloudinary.v2.uploader.destroy(
      `logo/${team.teamName}-${team.inTournament}`,
      (error, result) => {
      if(error){
        throw error
      }
      }
    );
    await Tournament.updateOne({'teams': team._id},{'$pull':{'teams':team._id}})
    team.remove()
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
  await Team.findByIdAndUpdate({ _id: req.params.id },
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
    req.io.sockets.emit('updateTeam', 'Tim diupdate')
    res.status(200).json("Update berhasil");
}
catch(error){
  res.status(500).json("Tidak dapat update");
}
};

const getAllTeam = async (req, res) => {
  try {
    const teams =  await Team.find().lean()
    res.json(teams);
  } catch (error) {
    res.status(404).json('Team yang anda cari tidak ada')
  }
  
}

const getTeamByID = async (req,res)=>{
  try {
  const team = await Team.findById({ _id: req.params.id }).lean();
    res.json(team);
  } catch (error) {
    res.status(404).json('Team yang anda cari tidak ada')
    
  }
}

const getTeam2ByID = async (req,res)=>{
  try {
  const team = await Team2.findById({ _id: req.params.id }).lean().populate({
    path:'roster',
    select:'_id username profilePicture'
  });
    res.json(team);
  } catch (error) {
    res.status(404).json('Team yang anda cari tidak ada')
    
  }
}


const createUserTeam = async (req, res)=>{
  const teamExist = await Team2.findOne({teamName: req.body.teamName})
  if(teamExist) return res.status(400).json('Nama tim sudah terpakai')

  const team = new Team2(req.body);

  try {
    const user = await User.findByIdAndUpdate({_id: req.params.id},{$push: {myTeam: team},},{new: true, upsert:true })
    team.roster.push(user)
    await team.save()
    res.status(200).json('Berhasil membuat team')
  } catch (error) {
    res.status(400).json('Tidak bisa membuat team')
  }
}

const deleteUserTeam = async (req,res)=>{
  try {
    const team = await Team2.findById({
    _id: req.params.teamId,
  });
  if (team) {
    cloudinary.v2.uploader.destroy(
      `logo/${team.teamName}-${team.inTournament}`,
      (error, result) => {
      if(error){
        throw error
      }
      }
    );
    await User.updateMany({'myTeam' : team._id}, {'$pull':{'myTeam' : team._id}})
    await Tournament.updateOne({'teams': team._id},{'$pull':{'teams':team._id}})
    team.remove()
    res.status(200).json('Berhasil menghapus team')
  }
  } catch (error) {
    res.status(400).json('Tidak bisa menghapus team')
  }
}

const addPlayerToTeam = async (req,res)=>{
  try {
    const team = await Team2.findById({_id: req.params.teamID})
    if(team.roster.includes(req.params.userID)) return res.status(400).json('Pemain sudah terdaftar dalam tim')

    await Team2.updateOne({_id: req.params.teamID}, {'$push': {'roster': req.params.userID}})
    await User.updateOne({_id: req.params.userID}, {'$push': {'myTeam': req.params.teamID}})
    res.status(200).json('Berhasil menambahkan pemain ke tim')
  } catch (error) {
    res.status(400).json('Gagal menambahkan pemain ke tim')
  }
}

const removePlayerFromTeam = async (req,res)=>{
  try {
    await Team2.updateOne({'roster': req.params.userID}, {'$pull': {'roster': req.params.userID}})
    await User.updateOne({'myTeam': req.params.teamID}, {'$pull': {'myTeam': req.params.teamID}})
    res.status(200).json('Berhasil menghapus pemain dari tim')
  } catch (error) {
    res.status(400).json('Gagal menghapus pemain dari tim')
  }
}



module.exports = {
  createTeam,
  updateTeam,
  deleteTeam,
  getAllTeam,
  getTeamByID,
  getTeam2ByID,
  createUserTeam,
  deleteUserTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
};

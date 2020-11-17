const User = require("../model/user");
const Team = require("../model/team");
const bcrypt = require("bcrypt");
const { loginValidation, signupValidation } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const Tournament = require("../model/tournament");
const Team2 = require("../model/team2");

const signUp = async (req, res) => {
  const { error } = signupValidation(req.body);
  if (error) return res.status(401).json(error.details[0].message);

  const usernameExist = await User.findOne({
    username: req.body.username
  });
  if (usernameExist) return res.status(400).json("Username sudah terpakai");

  const emailExist = await User.findOne({
    email: req.body.email
  });
  if (emailExist) return res.status(400).json("Email sudah terdaftar");

  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
      email: req.body.email
    });

    try {
      const savedUser = await user.save();
      res.json("Berhasil SignUp");
    } catch (error) {
      res.status(500).json("Gagal SignUp");
    }
  });
}

const login = async (req, res) => {
  try {
     const { error } = loginValidation(req.body);
  if (error) return res.status(401).json(error.details[0].message);
  if (req.body.username !== "" && req.body.password !== "") {
    const checkUsername = await User.findOne({ username: req.body.username });
    if (!checkUsername) return res.status(401).json("Username Salah");

    const password = await bcrypt.compare(
      req.body.password,
      checkUsername.password
    );
    if (!password) return res.status(401).json("Password Salah");

    const token = jwt.sign(
      { _id: checkUsername._id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "2 days",
      }
    );
    // Development
    // res.cookie("token", token, { httpOnly: true  }).status(200).json({msg: 'Login Sukses'});
    // Production
    res.cookie("token", token, { httpOnly: true, sameSite: 'none', secure: true   }).status(200).json({msg: 'Login Sukses'});
  }
  } catch (error) {
    res.status(401).json('Login gagal');
  }
}

const logout = (req,res)=>{
  try {
    // Development
    // res.clearCookie("token");
    // Production
    res.clearCookie("token",{ httpOnly: true, sameSite: 'none', secure: true   });
    res.status(200).json({ success: true , msg: 'Berhasil logout'});
  } catch (error) {
  res.status(400).json({msg: 'Gagal logout'})
  }
}

const getUserByID = async (req,res)=>{
  try {
    const user = await User.findById({ _id: req.params.id }, 'username _id profilePicture inTeam myTeam friends inTournaments pubgMobileID role')
    .populate({
      path:'myTeam',
      populate:{
        path: 'roster',
        model: 'User',
        select: '_id username'
      }
    })
    .populate('inTeam')
    .populate('friends')
    .populate('inTournaments')
    .exec()
    res.json(user);
    
  } catch (error) {
    res.status(404).json('User yang anda cari tidak ada')
  }
}

const checkAuthUser = (req,res)=>{
  res.json({success : true, msg : 'User diautentikasi', user: req.user})
}

const createTeam = async (req, res)=>{
  const teamExist = await Team2.findOne({teamName: req.body.teamName})
  if(teamExist) return res.status(400).json('Nama tim sudah terpakai')

  const team = new Team2(req.body);

  try {
    
    const user = await User.findByIdAndUpdate(
      {_id: req.params.id},
      {
      $push: {myTeam: team},
      },{new: true, upsert:true })
      team.roster.push(user)
      await team.save()
    res.status(200).json('Berhasil membuat team')
  } catch (error) {
    res.status(400).json('Tidak bisa membuat team')
  }
}

const deleteTeam = async (req,res)=>{
  try {
    const team = await Team2.findByIdAndDelete({
    _id: req.params.teamId,
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
    await User.updateOne({'myTeam' : team._id,'inTeam': team._id},{'$pull':{'myTeam':team._id, 'inTeam': team._id}})
    await Tournament.updateOne({'teams': team._id},{'$pull':{'teams':team._id}})
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
    await User.updateOne({_id: req.params.userID}, {'$push': {'inTeam': req.params.teamID}})
    res.status(200).json('Berhasil menambahkan pemain ke tim')
  } catch (error) {
    res.status(400).json('Gagal menambahkan pemain ke tim')
  }
}

const removePlayerFromTeam = async (req,res)=>{
  try {
    await Team2.updateOne({'roster': req.params.userID}, {'$pull': {'roster': req.params.userID}})
    await User.updateOne({'inTeam': req.params.teamID}, {'$pull': {'inTeam': req.params.teamID}})
    res.status(200).json('Berhasil menghapus pemain dari tim')
  } catch (error) {
    res.status(400).json('Gagal menghapus pemain dari tim')
  }
}

const joinTournament = async (req,res)=>{
  try {
    const tournament = await Tournament.findById({_id: req.params.idTournament})
    if(tournament.teams.includes(req.params.teamId)) return res.status(400).json('Tim sudah terdaftar dalam turnamen')
  
    const teamRoster = await Team2.findById({_id: req.params.teamId})
    if(teamRoster.roster.length < 4) return res.status(400).json('Tim ini tidak memiliki cukup pemain')

    await Tournament.updateOne({_id: req.params.idTournament},{'$push':{'teams':req.params.teamId}})
    await Team2.updateOne({_id: req.params.teamId},{'$push':{'inTournaments':req.params.idTournament}})
    await User.updateMany({'inTeam': req.params.teamId, 'myTeam': req.params.teamId}, {'$push':{'inTournaments': req.params.idTournament}})
    res.status(200).json('Berhasil menambahkan ke turnamen')
  } catch (error) {
    res.status(400).json('Gagal menambahkan ke turnamen')
  }
}
module.exports = {signUp, login,logout,getUserByID,checkAuthUser,createTeam,deleteTeam,joinTournament,addPlayerToTeam,removePlayerFromTeam}
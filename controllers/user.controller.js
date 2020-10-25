const User = require("../model/user");
const Team = require("../model/team");
const bcrypt = require("bcrypt");
const { loginValidation, signupValidation } = require("../utils/validation");
const jwt = require("jsonwebtoken");

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
      res.json("Success SignUp");
    } catch (error) {
      res.status(500).json(error);
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
    res.cookie("token", token, { httpOnly: true }).status(200).json({msg: 'Login Sukses'});
  }
  } catch (error) {
    res.status(401).json('Login gagal');
  }
}

const logout = (req,res)=>{
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true , msg: 'Berhasil logout'});
  } catch (error) {
  res.status(400).json({msg: 'Gagal logout'})
  }
}

const getUserByID = async (req,res)=>{
  try {
    const user = await User.findById({ _id: req.params.id }, 'username _id profilePicture myTeam pubgMobileID').populate('myTeam')
    res.json(user);
    
  } catch (error) {
    res.status(404).json('User yang anda cari tidak ada')
  }
}

const checkAuthUser = (req,res)=>{
  res.json({success : true, msg : 'User diautentikasi', user: req.user})
}

const createTeam = async (req, res)=>{
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
    await team.save()
    await User.findByIdAndUpdate(
      {_id: req.params.id},
      {
      $push: {myTeam: team},
      },
      (err,r)=>{
        if(err){
          res.status(400).json({msg: 'Tidak bisa membuat team'})
        }else{
          res.status(200).json({msg: 'Berhasil membuat team'})
        }
      })
    
  } catch (error) {
    res.status(400).json({msg: 'Tidak bisa membuat team'})
  }
}
module.exports = {signUp, login,logout,getUserByID,checkAuthUser,createTeam}
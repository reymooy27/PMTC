const User = require("../model/user");
const Team = require("../model/team");
const bcrypt = require("bcrypt");
const { loginValidation, signupValidation } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const Tournament = require("../model/tournament");
const Team2 = require("../model/team2");
const PUBGMobileStats = require('../model/pubgMobileStats')
const axios = require('axios').default;
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID)

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

const loginWithFacebook = async (req,res)=>{
  try {
    const {userID, accessToken} = req.body
    const urlGraphFB = `https://graph.facebook.com/v9.0/${userID}/?fields=id,name,email&access_token=${accessToken}`
    await axios.get(urlGraphFB)
    .then(async (response)=>{
      const user = await User.findOne({'facebook.id': response.data.id})
        if(user){
          const token = jwt.sign(
            { _id: user._id },
            process.env.TOKEN_SECRET,
            {
              expiresIn: "2 days",
            }
          );
          // Development
          // res.cookie("token", token, { httpOnly: true  }).status(200).json({msg: 'Login Sukses dengan Facebook'});
          // Production
          res.cookie("token", token, { httpOnly: true, sameSite: 'none', secure: true   }).status(200).json({msg: 'Login Sukses'});
        }else{
          const password = await bcrypt.hash(response.data.email, 10)
          const newUser = new User({
            username: response.data.name,
            email: response.data.email,
            password: password,
            facebook: {
              id: response.data.id,
              token: accessToken,
              email: response.data.email,
              name: response.data.name
            }
          })
          newUser.save()

          const token = jwt.sign(
          { _id: newUser._id },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "2 days",
          }
          );
          // Development
          // res.cookie("token", token, { httpOnly: true  }).status(200).json({msg: 'Login Sukses dengan Facebook'});
          // Production
        res.cookie("token", token, { httpOnly: true, sameSite: 'none', secure: true   }).status(200).json({msg: 'Login Sukses'});
        }
    })
    .catch(err=> console.log(err))
  } catch (error) {
    res.status(400).json('Gagal Login dengan Facebook')
  }
}

const loginWithGoogle = async(req,res)=>{
  try {
  const {tokenId} = req.body

  client.verifyIdToken({idToken: tokenId, audience: process.env.CLIENT_ID})
  .then(async (response)=>{
    const {email_verified,name,email} = response.payload
    if(email_verified){
      const user = await User.findOne({'google.email': email})
      if(user){
        const token = jwt.sign(
        { _id: user._id },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "2 days",
        }
        );
        // Development
        // res.cookie("token", token, { httpOnly: true  }).status(200).json({msg: 'Login Sukses dengan Google'});
        // Production
        res.cookie("token", token, { httpOnly: true, sameSite: 'none', secure: true   }).status(200).json({msg: 'Login Sukses'});
      }else{
        const password = await bcrypt.hash(email, 10)
        const newUser = new User({
          username: name,
          email: email,
          password: password,
          google: {
            email_verified,
            email,
            name
          }
        })
        newUser.save()

        const token = jwt.sign(
        { _id: newUser._id },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "2 days",
        }
        );
        // Development
        // res.cookie("token", token, { httpOnly: true  }).status(200).json({msg: 'Login Sukses dengan Google'});
        // Production
        res.cookie("token", token, { httpOnly: true, sameSite: 'none', secure: true   }).status(200).json({msg: 'Login Sukses'});
      }
    }else{
    res.status(400).json('Email belum diverifikasi')
    }
  })
  .catch(err=> console.log(err))

  } catch (error) {
    res.status(400).json('Gagal login dengan Google')
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

const getAllUser = async (req,res)=>{
  try {
    const users = await User.find().sort({username: 1}).lean().select('username profilePicture').exec()
    res.status(200).json(users)
  } catch (error) {
    res.status(400).json('Pemain yang anda cari tidak ada')
  }
}

const getUserByID = async (req,res)=>{
  try {
    const user = await User.findById({ _id: req.params.id })
    .select('-password')
    .populate('pubgMobileStats')
    .populate('myTeam')
    .populate('inTournaments')
    .populate('friends')
    .exec()
    res.json(user);
    
  } catch (error) {
    res.status(404).json('User yang anda cari tidak ada')
  }
}

const checkAuthUser = (req,res)=>{
  res.json({success : true, msg : 'User diautentikasi', user: req.user})
}

const updateProfilePicture = async (req,res)=>{
  const user = await User.findById({_id: req.params.id})
  const picturePath = req.file != null ? req.file.path : null;

  try {
    if(user){
    user.profilePicture = picturePath
    await user.save()
    res.status(200).json('Berhasil mengupload gambar')
    }
  } catch (error) {
    res.status(400).json('Gagal mengupload gambar')
  }
}

const updateUserProfile = async (req,res)=>{
  const user = await User.findById({_id: req.params.id})
  try {
    if(user){
    user.set(req.body)
    await user.save()
    return res.status(200).json('Berhasil mengupdate profil anda')
    }
  } catch (error) {
    res.status(400).json('Gagal mengupdate profil anda')
  }
}

const createTeam = async (req, res)=>{
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

const deleteTeam = async (req,res)=>{
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

const joinTournament = async (req,res)=>{
  try {
    const promisetournament = Tournament.findById({_id: req.params.idTournament})
    const promiseteamRoster = Team2.findById({_id: req.params.teamId})
    const [tournament, teamRoster] = await Promise.all([promisetournament, promiseteamRoster])

    if(tournament.teams.includes(req.params.teamId)) return res.status(400).json('Tim sudah terdaftar dalam turnamen')
    if(teamRoster.roster.length < 4) return res.status(400).json('Tim ini tidak memiliki cukup pemain')

    await Tournament.updateOne({_id: req.params.idTournament},{'$push':{'teams':req.params.teamId}})
    await Team2.updateOne({_id: req.params.teamId},{'$push':{'inTournaments':req.params.idTournament}})
    await User.updateMany({'myTeam': req.params.teamId}, {'$push':{'inTournaments': req.params.idTournament}})
    
    res.status(200).json('Berhasil menambahkan ke turnamen')
  } catch (error) {
    res.status(400).json('Gagal menambahkan ke turnamen')
  }
}

const addAccountPUBGMobile = async (req,res)=>{
  try {
    const user = await User.findById({_id: req.params.id})
    if(user.pubgMobileStats != null) return res.status(400).json('PUBG Mobile sudah ditambahkan')
    const pubgmStats = new PUBGMobileStats({
      nickInGamePUBGMobile: req.body.nickInGamePUBGMobile,
      idInGamePUBGMobile: req.body.idInGamePUBGMobile,
      userID: user._id
    })
    await pubgmStats.save()
    user.set({pubgMobileStats: pubgmStats})
    await user.save()
    res.status(200).json('Berhasil menambahkan akun game')
  } catch (error) {
    res.status(400).json('Gagal menambahkan akun game')
  }
}

const updateUserPubgMobileStats = async (req,res)=>{
  try {
    const stats = await PUBGMobileStats.findOne({userID: req.params.id})
    if(!stats) return res.status(404).json('User belum memiliki statistik')
    stats.set(req.body)
    await stats.save()
    res.status(200).json('Berhasil memperbarui statistik')
  } catch (error) {
    res.status(400).json('Gagal memperbarui statistik')
  }
}
module.exports = {
  signUp, 
  login,
  loginWithFacebook,
  loginWithGoogle,
  logout,
  getAllUser,
  getUserByID,
  checkAuthUser,
  createTeam,
  deleteTeam,
  joinTournament,
  addPlayerToTeam,
  removePlayerFromTeam,
  updateProfilePicture,
  updateUserProfile,
  addAccountPUBGMobile,
  updateUserPubgMobileStats
}
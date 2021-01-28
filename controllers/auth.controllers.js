const User = require("../model/user");
const bcrypt = require("bcrypt");
const { loginValidation, signupValidation } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const axios = require('axios').default;
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID)

const setting = process.env.NODE_ENV === 'production' ? { httpOnly: true, sameSite: 'none', secure: true} : { httpOnly: true}

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
    res.cookie("token", token, setting).status(200).json({msg: 'Login Sukses'});
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
          res.cookie("token", token, setting).status(200).json({msg: 'Login Sukses'});
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
        res.cookie("token", token, setting).status(200).json({msg: 'Login Sukses'});
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
        res.cookie("token", token, setting).status(200).json({msg: 'Login Sukses dengan Google'});
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
        res.cookie("token", token, setting).status(200).json({msg: 'Login Sukses dengan Google'});
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
    res.clearCookie("token",setting);
    res.status(200).json({ success: true , msg: 'Berhasil logout'});
  } catch (error) {
  res.status(400).json({msg: 'Gagal logout'})
  }
}

const checkAuthUser = (req,res)=>{
  res.json({success : true, msg : 'User diautentikasi', user: req.user})
}

module.exports = {
  signUp, 
  login,
  loginWithFacebook,
  loginWithGoogle,
  logout,
  checkAuthUser,
}
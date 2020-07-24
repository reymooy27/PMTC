const router = require("express").Router();
const User = require("../model/user");
const { loginValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// create new user
router.post("/signup", async (req, res) => {
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
    });

    try {
      const savedUser = await user.save();
      res.send("Success SignUp");
    } catch (error) {
      res.status(500).json(error);
    }
  });
});

// login user
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.body.username !== "" && req.body.password !== "") {
    const checkUsername = await User.findOne({ username: req.body.username });
    if (!checkUsername) return res.status(400).send("Username Salah");

    const password = await bcrypt.compare(
      req.body.password,
      checkUsername.password
    );
    if (!password) return res.status(400).send("Password Salah");

    const token = jwt.sign(
      { _id: checkUsername._id },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "2 days",
      }
    );
    res.header("authorization", token).status(200).json({ token });
  } else {
    res.json({ msg: "Username dan Password tidak boleh kososng" });
  }
});

module.exports = router;

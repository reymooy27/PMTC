const router = require("express").Router();
const Participant = require("../model/participant");
const Tournament = require("../model/tournament");
const sendEmail = require("../utils/sendEmail");

const verify = require("../utils/verifyToken");

router.get("/", async (req, res) => {
  await Participant.find().then((participants) => {
    res.render("index", {
      participant: participants,
    });
  });
});

router.get("/registration", async (req, res) => {
  await Tournament.find().then((tourney) => {
    if (tourney[0].registrationClosed) {
      res.redirect("/");
    } else {
      res.render("registration");
    }
  });
});

router.get("/admin", async (req, res) => {
  await Participant.find().then((participants) => {
    res.render("admin", {
      participant: participants,
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/redirect", (req, res) => {
  res.render("redirect");
});

router.post("/redirect", (req, res) => {
  sendEmail(req.body.email, req.body.teamName);
});
module.exports = router;

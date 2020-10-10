const router = require("express").Router();
const Participant = require("../model/participant");
const sendEmail = require("../utils/sendEmail");

const verify = require("../utils/verifyToken");

router.get("/", (req, res) => {
  res.send("Watermolan Sugar");
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

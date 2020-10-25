const router = require("express").Router();
const sendEmail = require("../utils/sendEmail");

router.get("/", (req, res) => {
  res.send("Watermolan Sugar");
});

router.post("/redirect", (req, res) => {
  sendEmail(req.body.email, req.body.teamName);
});
module.exports = router;

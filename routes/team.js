const router = require("express").Router();
const { upload } = require("../utils/uploadLogo");
const teamCtrl = require("../controllers/team.controller");
const verify = require('../utils/verifyToken');

router.post("/api/v1/teams", teamCtrl.getAllTeam);
router.post("/team/create/:id", upload, teamCtrl.createTeam);
router.post("/team/:id",teamCtrl.getTeamByID);
router.put("/team/update/:id", verify, teamCtrl.updateTeam);
router.delete("/team/delete/:id", verify, teamCtrl.deleteTeam);

module.exports = router;

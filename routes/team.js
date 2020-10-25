const router = require("express").Router();
const { upload } = require("../utils/uploadLogo");
const teamCtrl = require("../controllers/team.controller");

router.post("/api/v1/teams", teamCtrl.getAllTeam);
router.post("/team/create", upload, teamCtrl.createTeam);
router.post("/team/:id",teamCtrl.getTeamByID);
router.put("/team/update/:id", teamCtrl.updateTeam);
router.delete("/team/delete/:id", teamCtrl.deleteTeam);

module.exports = router;

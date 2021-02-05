const router = require("express").Router();
const { upload } = require("../utils/uploadLogo");
const teamCtrl = require("../controllers/team.controller");
const verify = require('../utils/verifyToken');

router.get("/api/v1/teams", teamCtrl.getAllTeam);
router.get("/team/:id",teamCtrl.getTeamByID);
router.get("/team2/:id",teamCtrl.getTeam2ByID);
router.post("/team/create/:id", upload, teamCtrl.createTeam);
router.put("/team/update/:id", verify, teamCtrl.updateTeam);
router.delete("/team/delete/:id", verify, teamCtrl.deleteTeam);
router.post("/user/:id/team/create", verify, teamCtrl.createUserTeam);
router.delete("/user/team/:teamId/delete",verify, teamCtrl.deleteUserTeam);
router.post("/team/invite/:id",verify, teamCtrl.teamInvite);
router.post("/team/invite/update/:id",verify, teamCtrl.updateTeamInvite);
router.post("/team/invite/cancel/:id",verify, teamCtrl.cancelTeamInvite);
router.post("/team/:teamID/user/:userID/remove",verify, teamCtrl.removePlayerFromTeam);

module.exports = router;

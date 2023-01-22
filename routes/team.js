const router = require("express").Router();
const { upload } = require("../utils/uploadLogo");
const teamCtrl = require("../controllers/team.controller");
const verify = require('../utils/verifyToken');

router.get("/team2/:id",teamCtrl.getTeam2ByID);
router.post("/user/:id/team/create", verify, teamCtrl.createUserTeam);
router.delete("/user/team/:teamId/delete",verify, teamCtrl.deleteUserTeam);
router.post("/team/invite/:id",verify, teamCtrl.teamInvite);
router.post("/team/invite/update/:id",verify, teamCtrl.updateTeamInvite);
router.post("/team/invite/cancel/:id",verify, teamCtrl.cancelTeamInvite);
router.post("/team/:teamID/user/:userID/remove",verify, teamCtrl.removePlayerFromTeam);

module.exports = router;

const router = require("express").Router();
const userCtrl = require('../controllers/user.controller')
const verify = require('../utils/verifyToken');
const {uploadProfilePicture} = require('../utils/uploadProfilePicture')

router.post("/user/:id", userCtrl.getUserByID);
router.post("/user/:id/team/create", verify, userCtrl.createTeam);
router.patch("/user/:id/profilePicture/upload",verify, uploadProfilePicture, userCtrl.updateProfilePicture);
router.post("/tournament/:idTournament/team/:teamId/join",verify, userCtrl.joinTournament);
router.post("/team/:teamID/user/:userID/add",verify, userCtrl.addPlayerToTeam);
router.post("/team/:teamID/user/:userID/remove",verify, userCtrl.removePlayerFromTeam);
router.delete("/user/team/:teamId/delete",verify, userCtrl.deleteTeam);
router.post("/signup",userCtrl.signUp );
router.post("/login", userCtrl.login);
router.get("/logout", userCtrl.logout);
router.get("/status", verify, userCtrl.checkAuthUser);

module.exports = router;

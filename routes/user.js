const router = require("express").Router();
const userCtrl = require('../controllers/user.controller')
const verify = require('../utils/verifyToken');
const {uploadProfilePicture} = require('../utils/uploadProfilePicture')

router.post("/user/all", userCtrl.getAllUser);
router.post("/user/:id", userCtrl.getUserByID);
router.patch("/user/:id/update", verify, userCtrl.updateUserProfile);
router.patch("/user/:id/profilePicture/upload",verify, uploadProfilePicture, userCtrl.updateProfilePicture);
router.post("/user/:id/game/pubgMobile/add", verify, userCtrl.addAccountPUBGMobile);
router.patch("/user/:id/game/pubgMobile/update", verify, userCtrl.updateUserPubgMobileStats);
router.post("/user/:id/team/create", verify, userCtrl.createTeam);
router.delete("/user/team/:teamId/delete",verify, userCtrl.deleteTeam);
router.post("/team/:teamID/user/:userID/add",verify, userCtrl.addPlayerToTeam);
router.post("/team/:teamID/user/:userID/remove",verify, userCtrl.removePlayerFromTeam);
router.post("/tournament/:idTournament/team/:teamId/join",verify, userCtrl.joinTournament);
router.post("/signup",userCtrl.signUp );
router.post("/login/google", userCtrl.loginWithGoogle);
router.post("/login/facebook", userCtrl.loginWithFacebook);
router.post("/login", userCtrl.login);
router.get("/logout", userCtrl.logout);
router.get("/status", verify, userCtrl.checkAuthUser);

module.exports = router;

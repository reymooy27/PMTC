const router = require("express").Router();
const userCtrl = require('../controllers/user.controller')
const verify = require('../utils/verifyToken');

router.post("/user/:id", userCtrl.getUserByID);
router.post("/user/:id/team/create", userCtrl.createTeam);
router.post("/signup",userCtrl.signUp );
router.post("/login", userCtrl.login);
router.get("/logout", userCtrl.logout);
router.get("/status", verify, userCtrl.checkAuthUser);

module.exports = router;

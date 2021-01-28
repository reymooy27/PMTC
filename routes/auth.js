const router = require("express").Router();
const verify = require('../utils/verifyToken');
const authCtrl = require('../controllers/auth.controllers')

router.post("/signup",authCtrl.signUp );
router.post("/login/google", authCtrl.loginWithGoogle);
router.post("/login/facebook", authCtrl.loginWithFacebook);
router.post("/login", authCtrl.login);
router.get("/logout", authCtrl.logout);
router.get("/status", verify, authCtrl.checkAuthUser);

module.exports = router;
const router = require("express").Router();
const userCtrl = require('../controllers/user.controller')
const verify = require('../utils/verifyToken');
const {uploadProfilePicture} = require('../utils/uploadProfilePicture')

router.get("/user/all", userCtrl.getAllUser);
router.get("/user/:id", userCtrl.getUserByID);
router.patch("/user/:id/update", verify, userCtrl.updateUserProfile);
router.patch("/user/:id/profilePicture/upload",verify, uploadProfilePicture, userCtrl.updateProfilePicture);
router.get("/user/unfriend/:id", verify, userCtrl.unFriend);



module.exports = router;

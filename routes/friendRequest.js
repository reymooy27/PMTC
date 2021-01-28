const router = require('express').Router();
const frCtrl = require('../controllers/friendRequest.controller')
const verify = require('../utils/verifyToken')

router.post('/friendRequest/send/:id', verify, frCtrl.sendFriendRequest)
router.post('/friendRequest/update/:id', verify, frCtrl.updateFriendRequest)
router.get('/friendRequest', verify, frCtrl.getFriendRequests)

module.exports = router
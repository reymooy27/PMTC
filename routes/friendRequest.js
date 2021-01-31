const router = require('express').Router();
const frCtrl = require('../controllers/friendRequest.controller')
const verify = require('../utils/verifyToken')

router.post('/friendRequest/send/:id', verify, frCtrl.sendFriendRequest)
router.post('/friendRequest/update/:id', verify, frCtrl.updateFriendRequest)
router.get('/friendRequest/:id', verify, frCtrl.getFriendRequests)
router.get('/friendRequest/cancel/:id', verify, frCtrl.cancelFriendRequest)

module.exports = router
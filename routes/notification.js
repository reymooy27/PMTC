const router = require('express').Router()
const verify = require('../utils/verifyToken')
const notificationCtrl  =require('../controllers/notification.controller')

router.get('/notifications', verify, notificationCtrl.getNotifications)

module.exports = router;


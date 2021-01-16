const router = require('express').Router();
const chatCtrl = require('../controllers/chat.controllers')
const verify = require('../utils/verifyToken')
router.post('/chat/:id', verify, chatCtrl.sendMessage)
router.post('/chats/:id', verify, chatCtrl.getUserConversationMessages)
router.post('/chatList', verify, chatCtrl.getUserChatList)

module.exports = router
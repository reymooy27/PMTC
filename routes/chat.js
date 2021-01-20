const router = require('express').Router();
const chatCtrl = require('../controllers/chat.controllers')
const verify = require('../utils/verifyToken')
router.post('/chat/:id', verify, chatCtrl.sendMessage)
router.get('/chats/:id', verify, chatCtrl.getUserConversationMessages)
router.get('/chatList', verify, chatCtrl.getUserChatList)

module.exports = router
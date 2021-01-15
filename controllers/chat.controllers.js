const Chat = require('../model/chat')
const Conversations = require('../model/conversations')

const sendMessage = async (req,res)=>{
  try {
    const conversation = await Conversations.findOne({
      recipients: {
        $all: [req.user._id,req.params.id]
      },
    })
    if(conversation !== null){
      conversation.lastMessage = req.body.message
      conversation.save()
      const message = new Chat({
        conversation: conversation._id,
        to: req.params.id,
        from: req.user._id,
        message: req.body.message,
      });
      message.save()
      req.io.sockets.emit('sendMessage', req.body.message)
      return res.status(200).json('Berhasil mengirim pesan')
    }else{
      const newConversation = new Conversations({
        recipients: [req.user._id,req.params.id],
        lastMessage: req.body.lastMessage
      })
      newConversation.save()
      const message = new Chat({
        conversation: conversation._id,
        to: req.params.id,
        from: req.user._id,
        message: req.body.message,
      });
      message.save()
      req.io.sockets.emit('sendMessage', req.body.message)
      return res.status(200).json('Berhasil mengirim pesan')
    }
  } catch (error) {
    res.status(400).json('Gagal mengirim pesan')
  }
}

const getUserConversation = async (req,res)=>{
  try {
    const messages = await Chat.find({conversation: req.params.id}).lean()
    res.status(200).json(messages)
  } catch (error) {
    res.status(400).json('Gagal mendapatkan pesan')
  }
}

const getUserChatList = async (req,res)=>{
  try {
    console.log(req.user._id);
    const conversationList = await Conversations.find(
      {
        recipients:{
          $all: [req.user._id]
        }
      })
      .populate({
        path: 'recipients',
        model: 'User',
        select: { '_id': 1,'username':1, 'profilePicture': 1},
      })
    res.status(200).json(conversationList)
  } catch (error) {
    res.status(400).json('Gagal mendapatkan pesan')
  }
}

module.exports = {
  sendMessage,
  getUserConversation,
  getUserChatList
}
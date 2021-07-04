const { ChatMessage } = require("../models/chat");

const fetchAllChats = async (req, res) => {
  try {
    const chats = await ChatMessage.find({ teamId: req.query.teamId})
      .populate("sender", "name photoUrl")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name photoUrl",
        },
        select: "MessageBody sender timestamp",
      }).sort('timestamp');
    return res.status(200).json({
      message: chats,
    });
  } catch (error) {
    console.log(error.toString());
    return res
      .status(500)
      .json({
        message: "Could not fetch all messages",
        error: error.toString(),
      });
  }
};
const sendMessage = async (req, res) => {
  try {
    const teamId = req.query.teamId;
    const { uid, messageBody, replyTo } = req.body;
    const newMessage = new ChatMessage({
      teamId: teamId,
      sender: uid,
      messageBody: messageBody.trim(),
      replyTo: replyTo,
      timestamp: new Date().toISOString(),
      isPinned: false,
    });
    await newMessage.save();
    const send = await ChatMessage.findById(newMessage._id)
      .populate("sender", "name ")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name photoUrl",
        },
        select: "MessageBody sender timestamp",
      });
      // global.io.to(send.teamId).emit("message", send);
    return res.status(200).json({
      message: send,
    });
  } catch (error) {
    console.log(error.toString())
    return res
      .status(500)
      .json({ message: "Could not send message", error: error.toString() });
  }
};

module.exports = {
  fetchAllChats,
  sendMessage,
};

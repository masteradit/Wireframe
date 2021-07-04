/* eslint-disable camelcase */
const { ChatMessage } = require("../../models/chat");

const generateMessage = async (teamId, uid, messageBody, replyTo) => {
  //   const x= Math.floor(Math.random() * (1+1)+1);
  //   uid =uids[x-1];
  try {
    const newMessage = new ChatMessage({
      teamId: teamId,
      sender: uid,
      messageBody: messageBody,
      replyTo: replyTo,
      timestamp: new Date().toISOString(),
      isPinned: false,
    });
    await newMessage.save();
    const send = await ChatMessage.findById(newMessage._id)
      .populate("sender", "name photoUrl")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name photoUrl",
        },
        select: "message_body sender timestamp",
      });
    return send;
  } catch (error) {
    return error;
  }
  // const newMessage = ChatMessage({
  //   chatroom: chatroom_id,
  //   type: chatType.NORMAL,
  //   sender: uid,
  //   message_body: message_body,
  //   seenBy: [],
  //   replyTo: chat_id,
  //   deletedBy: [],
  //   starredBy: [],
  // });
  // const send = newMessage;
  // send.sender =await User.findOne({_id: uid}, {name: 1, photoUrl: 1});
  // await newMessage.save();
  // return send;
};

module.exports = {
  generateMessage: generateMessage,
};

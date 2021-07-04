const mongoose = require("mongoose");
const objId = mongoose.Schema.Types.ObjectId;
const chatMessageSchema = new mongoose.Schema(
  {
    teamId: {
      type: objId,
      ref: "Team",
      required: true,
    },
    messageBody: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    replyTo: {
      type: objId,
      ref: "Chat",
    },
    sender: {
      type: objId,
      ref: "User",
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = {
  ChatMessage: mongoose.model("Chat", chatMessageSchema),
};

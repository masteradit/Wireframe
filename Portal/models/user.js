const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    role: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    participantId: {
      type: String,
      required: true,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    college: {
      type: String,
    },
    regNo: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    socketId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);
const tokenSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = {
  User: mongoose.model("User", userSchema),
  Token: mongoose.model("Token", tokenSchema),
};

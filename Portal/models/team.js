const mongoose = require("mongoose");
const objId = mongoose.Schema.Types.ObjectId;
const teamSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: objId,
        ref: "User",
        required: true,
      },
    ],
    teamId: {
      type: Number,
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    teamDesc: {
      type: String,
    },
    createdBy: {
      type: objId,
      ref: "User",
      required: true,
    },
    submissionId: {
      type: objId,
      ref: "Submission",
    },
    key: String,
  },
  { timestamps: true }
);

module.exports = {
  Team: mongoose.model("Team", teamSchema),
};

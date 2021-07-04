const mongoose = require("mongoose");
const { FileSchema } = require("./file");
const objId = mongoose.Schema.Types.ObjectId;
const submissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: objId,
      ref: "Team",
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    appName: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: null,
    },
    attachments: [{ type: FileSchema }],
    category: {
      type: String,
      default: "WEB"
    },
    submitTimestamp: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = {
  Submission: mongoose.model("Submission", submissionSchema),
};

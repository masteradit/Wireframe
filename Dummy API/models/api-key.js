const mongoose = require("mongoose");
const apikeyModel = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  key: {
    type: String,
    default: null,
  },
  requestsPerMin: {
    type: Number,
    default: 0,
  },
  totalRequests: {
    type: Number,
    default: 0,
  },
});

module.exports = {
  apikey: mongoose.model("apikey", apikeyModel),
};

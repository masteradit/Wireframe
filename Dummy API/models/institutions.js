const mongoose = require("mongoose");

const institutionsModel = new mongoose.Schema({
  area_name: String,
  type: String,
  year: Number,
  value: Number,
  variable: String,
});

module.exports = {
  institution: mongoose.model("instituion", institutionsModel),
};

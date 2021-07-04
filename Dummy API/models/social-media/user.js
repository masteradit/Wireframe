const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  title: String,
  firstName: String,
  lastName: String,
  gender: String,
  email: String,
  dateOfBirth: String,
  registerDate: Date,
  phone: String,
  picture: String,
  location: {
    street: String,
    city: String,
    state: String,
    country: String,
    timezone: String,
  },
});

module.exports = {
  socialMediaUser: mongoose.model("socialMediaUser", userModel),
};

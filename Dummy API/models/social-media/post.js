const mongoose = require("mongoose");

const postsModel = new mongoose.Schema({
  text: String,
  image: String,
  likes: Number,
  link: String,
  tags: [String],
  publishDate: Date,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "socialMediaUser",
  },
});

module.exports = {
  socialMedialPosts: mongoose.model("socialMediaPost", postsModel),
};

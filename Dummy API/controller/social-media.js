const { socialMediaUser } = require("../models/social-media/user");
const { socialMedialPosts } = require("../models/social-media/post");

const fetchUsers = async (req, res) => {
  try {
    const results = await socialMediaUser.find({});
    res.json({ count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const fetchUserDetails = async (req, res) => {
  try {
    const results = await socialMediaUser.findById(req.params.userId);
    res.json({ count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const fetchPosts = async (req, res) => {
  try {
    const results = await socialMedialPosts.find({});
    res.json({ count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
const fetchPostDetails = async (req, res) => {
  try {
    const results = await socialMedialPosts
      .findById(req.params.postId)
      .populate("owner", "firstName lastName");
    res.json({ count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};
module.exports = {
  fetchUsers,
  fetchUserDetails,
  fetchPosts,
  fetchPostDetails,
};

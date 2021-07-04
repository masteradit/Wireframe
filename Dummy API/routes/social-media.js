const {
  fetchUsers,
  fetchPosts,
  fetchUserDetails,
  fetchPostDetails,
} = require("../controller/social-media");
const validateKey = require("../utils/validateApiKey");

const router = require("express").Router();

router.get("/users", validateKey, fetchUsers);
router.get("/user/:userId", validateKey, fetchUserDetails);
router.get("/posts", validateKey, fetchPosts);
router.get("/post/:postId", validateKey, fetchPostDetails);

module.exports = router;

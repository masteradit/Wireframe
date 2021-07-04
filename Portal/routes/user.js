const router = require("express").Router();
const {
  register,
  login,
  updateUser,
  getUser,
  logout,
  confirmation,
  resend,
  forgotPassword,
  resetPassword,
} = require("../controller/user");
const authenticate = require("../utils/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/confirmation/:token", confirmation);
router.post("/resend", resend);
router.post("/reset-password/:token", resetPassword);
router.post("/password-reset", forgotPassword);
router.get("/logout", authenticate.verifyUser, logout);
router.get("/user", authenticate.verifyUser, getUser);
router.patch("/user", authenticate.verifyUser, updateUser);

module.exports = router;

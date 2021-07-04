const router = require("express").Router();
const { fetchAllChats, sendMessage } = require("../controller/chat");
const authenticate = require("../utils/auth");
router.get("/chats", authenticate.verifyUser, fetchAllChats);
router.post("/chat", authenticate.verifyUser, sendMessage);

module.exports = router;

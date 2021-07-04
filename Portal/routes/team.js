const router = require("express").Router();
const {
  createTeam,
  joinTeam,
  removeMember,
  deleteTeam,
  displayTeam,
  generateApiKey,
} = require("../controller/team");
const authenticate = require("../utils/auth");

router.post("/team", authenticate.verifyUser, createTeam);
router.get("/team", authenticate.verifyUser, displayTeam);
router.post("/team/join/", authenticate.verifyUser, joinTeam);
router.delete(
  "/team/member",
  authenticate.verifyUser,
  removeMember
);
router.delete(
  "/team",
  authenticate.verifyUser,
  authenticate.isTeamLeader,
  deleteTeam
);
router.post(
  "/team/generate-apikey",
  authenticate.verifyUser,
  authenticate.isTeamLeader,
  generateApiKey
);
module.exports = router;

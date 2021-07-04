const passport = require("passport");
const { Team } = require("../models/team");

const verifyUser = passport.authenticate("jwt", { session: false });

const isTeamMember = async (req, res, next) => {
  try {
    console.log(req.query);
    const teamMember = await Team.exists({
      _id: req.query.teamId,
      participants: req.user._id,
    });
    if (!teamMember) {
      return res.status(400).json({ message: "Unauthorized Access" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

const isTeamLeader = async (req, res, next) => {
  try {
    console.log(req.query);
    const teamLead = await Team.exists({
      _id: req.query.teamId,
      createdBy: req.user._id,
    });
    if (!teamLead) {
      return res.status(400).json({ message: "Unauthorized Access" });
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  verifyUser,
  isTeamMember,
  isTeamLeader,
};

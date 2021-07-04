const { Team } = require("../models/team");
const { Submission } = require("../models/submission");
const ObjectID = require("mongodb").ObjectID;
const { User } = require("../models/user");
const { apikey } = require("../models/api-key");
const createTeam = async (req, res) => {
  try {
    const userexists = await Team.exists({
      participants: req.user._id,
    });
    if (userexists) {
      return res.status(400).json({ msssage: "User is already in a team" });
    }
    const teamId = ObjectID();
    const submissionId = ObjectID();
    const team = await Team.create({
      _id: teamId,
      participants: [req.user._id],
      createdBy: req.user._id,
      teamName: req.body.teamName.trim(),
      teamDesc: req.body.teamDesc.trim(),
      submissionId: submissionId,
      teamId: ("" + Math.random()).substring(2, 7),
    });
    const submission = new Submission({
      _id: submissionId,
      teamId: teamId,
    });
    await submission.save();
    const apiKey = new apikey({
      team: teamId,
    });
    apiKey.save();
    if (team) {
      const teamDetailed = await Team.findOne({ _id: team._id}).populate('participants', 'name').populate(
        "submissionId"
      );
      res.status(200).json({
        message: { team: teamDetailed },
      });
    } else {
      res.status(400).json({ message: "Unable to create team" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Team could not be created", error: error.toString() });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndRemove(req.query.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    await apikey.findOneAndRemove ({ team: team._id });
    res.json({ message: "Deleted team successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Team could not be deleted", error: error.toString() });
  }
};
const displayTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ participants: req.user._id }).populate('participants', 'name').populate(
      "submissionId"
    );
    if(team){
    const key = await apikey.findOne({ team: team._id });
    team.key = key.key;
    }
    res.json({ message: team });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "No team found", error: error.toString() });
  }
};

const joinTeam = async (req, res) => {
  try {
    console.log(!req.query.participantId);
    const user = !req.query.participantId
      ? req.user
      : await User.findOne({ participantId: req.query.participantId });
    const participantId = user._id;
    const team = await Team.exists({
      participants: participantId,
    });
    if (team) {
      return res.status(400).json({ message: "User is already in a team" });
    } else {
      const teamDetail = await Team.findOne({teamId:req.query.teamId});
      if (teamDetail.participants.length >= 2) {
        return res
          .status(400)
          .json({ message: `Maximum size of team is ${teamSize}` });
      } 
      await Team.updateOne(
       {teamId: req.query.teamId},
        {
          $addToSet: { participants: participantId },
        }
      );
      const newTeam = await Team.findOne(
        {teamId: req.query.teamId},
       ).populate('participants', 'name').populate("submissionId");
      return res.status(200).json({
        message: `User added to team ${req.query.teamId} Successfully`,
        team: newTeam,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "User unable able to join the team. Try Again.",
      error: error.toString(),
    });
  }
};

const   removeMember = async (req, res) => {
  try {
    const newTeam = await Team.findByIdAndUpdate(
      req.query.teamId,
      {
        $pull: { participants: req.body.member },
      },
      { new: true }
    ).populate('participants', 'name');
    return res.status(200).json({
      message: "User removed successfully",
      team: newTeam,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "User could not be removed", error: error.toString() });
  }
};

const generateApiKey = async (req, res) => {
  try {
    const key = await apikey.findOne({ team: req.query.teamId });
    if (key.key)
      return res
        .status(404)
        .json({ message: "Team has already generated the key" });
    const addkey =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const apiKey = await apikey.findOneAndUpdate(
      { team: req.query.teamId },
      {
        $set: {
          key: addkey,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Apikey generated successfully",
      apikey: apiKey,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Apikey not generated", error: error.toString() });
  }
};

module.exports = {
  createTeam,
  joinTeam,
  deleteTeam,
  removeMember,
  displayTeam,
  generateApiKey,
};

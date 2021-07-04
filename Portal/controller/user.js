const { User, Token } = require("../models/user");
const { Team } = require("../models/team");
const bcrypt = require("bcryptjs");
const jwtUtils = require("../utils/jwt");
const fetch = require("node-fetch");
const axios = require('axios');
const register = async (req, res) => {
  try {
    const { name, email, phone, college, regNo } = req.body;
    const emailExists = await User.exists({ email: req.body.email });
    if (emailExists)
      return res.status(409).json({ message: "Email already in use" });
    if (req.body.password.trim() !== req.body.password_confirmation.trim()) {
      return res.status(409).json({ message: "Passwords do not match" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password.trim(), salt);

    const newUser = new User({
      name: name.trim(),
      email: email.trim(),
      phoneNo: phone.trim(),
      college: college.trim(),
      regNo: regNo.trim(),
      password: hash,
      confirmed: false,
      participantId: ("" + Math.random()).substring(2, 7),
    });
    await newUser.save();

    const jwt = await jwtUtils.generateAuthJwt(newUser);
    const tokenArray = jwt.token.split(" ");
    const jwtToken = tokenArray[1];
    const token = new Token({
      _userId: newUser._id,
      token: jwtToken,
    });
    await token.save();
    const emailResponse =await axios({
      method: 'post',
      url: 'https://mail.iecsemanipal.com/wireframe/verifyaccount',
      data: {
        name: newUser.name,
        link: "https://wireframe.iecsemanipal.com/#/confirmation/" + token.token,
        toEmail: newUser.email,
      },
      headers: {
        Authorization: process.env.MAILER_KEY,
        "Content-Type": "application/json",
      },

    });
    if (emailResponse.status === 200) {
      return res.status(200).json({
        message: {
          message: "Verification mail sent successfully",
          token: token.token,
          // expiresIn: jwt.expiresIn,
          uid: newUser._id,
          email: true,
        },
      });
    } else {
      return res.status(emailResponse.status).json({
        message: {
          message: "Verification mail could not be sent",
          token: token.token,
          // expiresIn: jwt.expiresIn,
          uid: newUser._id,
          email: false,
        },
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "User Registration Failed", error: error.toString() });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Invalid email" });
    if (!user.confirmed)
      return res.status(401).json({ message: "Verification Pending" });
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });
    const jwt = await jwtUtils.generateAuthJwt(user);
    const tokenArray = jwt.token.split(" ");
    const jwtToken = tokenArray[1];
    const token = await Token.findOneAndUpdate(
      { _userId: user._id },
      { token: jwtToken },
      { new: true }
    );
    return res.status(200).json({
      token: token.token,
      message: "User Signed in Successfully ",
      // expiresIn: jwt.expiresIn,
      uid: user._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login Unsuccessfull", error: error.toString() });
  }
};

const logout = async (req, res) => {
  try {
    // console.log(req.user._id)
    const token = await Token.exists({ _userId: req.user._id });
    if (token) {
      await Token.updateOne(
        { _userId: req.user._id },
        {
          $set: {
            token: null,
          },
        }
      );
      return res.status(200).json({ message: "Logout successful" });
    } 
    else return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Logout Failed", error: error.toString() });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    const team = await Team.find({ participants: req.user._id }).populate(
      "submission"
    );
    if (!user) return res.status(400).json({ message: "User not found" });
    return res.status(200).json({
      message: { user, team },
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "User details could not be fetched.",
        error: error.toString(),
      });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.user },
      { $set: req.body },
      { new: true }
    );
    if (!user) return res.status(400).send("User not found");
    return res.status(200).json({
      message: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "User details could not be updated",
      error: error.toString(),
    });
  }
};

const confirmation = async (req, res) => {
  try {
    let userId = await Token.findOne({ token: req.params.token });
    if (userId === null) {
      return res
        .status(400)
        .json({ message: "Email Confirmation failed. Try Again." });
    } else {
      userId = userId._userId;
      await User.findByIdAndUpdate(
        { _id: userId },
        { confirmed: true },
        { new: true }
      );
      return res.status(200).json({
        message: "Email Confirmed Successfully.",
      });;
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Email Confirmation failed. Try Again.",
        error: error.toString(),
      });
  }
};

const resend = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid email" });
    if (user.confirmed)
      return res
        .status(400)
        .json({ message: "Email already confirmed. Please login." });
    const jwt = await jwtUtils.generateAuthJwt(user);
    const tokenArray = jwt.token.split(" ");
    const jwtToken = tokenArray[1];
    const token = await Token.findOneAndUpdate(
      { _userId: user._id },
      { token: jwtToken },
      { new: true }
    );
    const emailResponse =await axios({
      method: 'post',
      url: 'https://mail.iecsemanipal.com/wireframe/verifyaccount',
      data: {
        name: user.name,
        link: "https://wireframe.iecsemanipal.com/#/confirmation/" + token.token,
        toEmail: user.email,
      },
      headers: {
        Authorization: process.env.MAILER_KEY,
        "Content-Type": "application/json",
      },

    });
    if (emailResponse.status === 200) {
      return res.status(200).json({
        message: {
          message: "Verification mail sent successfully",
          token: token.token,
          // expiresIn: jwt.expiresIn,
          uid: user._id,
          email: true,
        },
      });
    } else {
      return res.status(emailResponse.status).json({
        message: {
          message: "Verification mail could not be sent",
          token: token.token,
          // expiresIn: jwt.expiresIn,
          uid: user._id,
          email: false,
        },
      });
    }
  } catch (error) {
    console.log(error.toString())
    return res.status(500).json({
      message: "Could not send email confirmation. Try Again",
      error: error.toString(),
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "Invalid email" });
    const jwt = await jwtUtils.generateAuthJwt(user);
    const tokenArray = jwt.token.split(" ");
    const jwtToken = tokenArray[1];
    const token = await Token.findOneAndUpdate(
      { _userId: user._id },
      { token: jwtToken },
      { new: true }
    );
    const emailResponse =await axios({
      method: 'post',
      url: 'https://mail.iecsemanipal.com/wireframe/resetpassword',
      data:  {
        name: user.name,
        link: "https://wireframe.iecsemanipal.com/#/reset/" + token.token,
        toEmail: user.email,
      },
      headers: {
        Authorization: process.env.MAILER_KEY,
        "Content-Type": "application/json",
      },

    });
    // console.log(emailResponse)
    if (emailResponse.status === 200) {
      return res.status(200).json({
        message: {
          message: "Link to reset password sent successfully",
          token: token.token,
          // expiresIn: jwt.expiresIn,
          uid: user._id,
          email: true,
        },
      });
    } else {
      return res.status(emailResponse.status).json({
        message: {
          message: "Link to reset password could not be sent",
          token: token.token,
          // expiresIn: jwt.expiresIn,
          uid: user._id,
          email: false,
        },
      });
    }
  } catch (error) {
    // console.log(error.toString())
    return res
      .status(500)
      .json({
        message: "Could not send email. Try Again",
        error: error.toString(),
      });
  }
};

const resetPassword = async (req, res) => {
  try {
    if (req.body.password !== req.body.password_confirmation) {
      return res.status(409).json({ message: "Passwords do not match" });
    }
    let userId = await Token.findOne({ token: req.params.token });
    if (userId === null) {
      return res
        .status(400)
        .json({ message: "Password reset failed. Try Again." });
    } else {
      userId = userId._userId;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      await User.findByIdAndUpdate(
        { _id: userId },
        { password: hash },
        { new: true }
      );
      await Token.updateOne(
        { _userId: userId },
        {
          $set: {
            token: null,
          },
        }
      );
      return res.status(200).json({ message: "Password changed successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Registeration failed.", error: error.toString() });
  }
};

module.exports = {
  register: register,
  login: login,
  updateUser: updateUser,
  getUser: getUser,
  logout: logout,
  resend: resend,
  confirmation: confirmation,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
};

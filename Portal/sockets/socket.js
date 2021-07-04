/* eslint-disable camelcase */

// const socketio = require('socket.io');
const { Team } = require("../models/team");
const { userOnline, userOffline } = require("./utils/user");
const { generateMessage } = require("./utils/messages");

module.exports = () => {
  global.io.on("connection", (socket) => {
    global.socket = socket;
    console.log("New WebSocket connection");

    socket.on("join", async (uid) => {
      try {
        console.log("uid: --> ", uid);
        await userOnline(uid, socket.id);
        const team = await Team.findOne({ participants: uid });
        socket.join(team._id);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("leave", async (uid) => {
      try {
        await userOfline(uid, socket.id);
        const team = await Team.findOne({ participants: uid });
        socket.leave(team._id);
      } catch (error) {
        console.log(error);
      }
    });

    // send messages using sockets
    socket.on(
      "sendMessage",
      async ({ teamId, uid, messageBody, replyTo }, callback) => {
        console.log({ teamId, uid, messageBody, replyTo });
        try {
          const message = await generateMessage(
            teamId,
            uid,
            messageBody,
            replyTo
          );
          console.log(message);
          global.io.to(teamId).emit("message", message);
          callback();
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", async (uid) => {
      try {
        console.log("Disconnecting..." + socket.id);
        await userOffline(socket.id);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

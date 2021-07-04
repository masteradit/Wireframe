require("dotenv").config();
const app = require("./app");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
global.io = socketio(server);
require("./sockets/socket")(server);
app;

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
server.listen(port, function () {
  console.log("Server started on port " + port);
});

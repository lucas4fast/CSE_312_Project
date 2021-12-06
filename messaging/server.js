const express = require("express");
var path = require("path");
const app = express();
const server = require("http").createServer(app);
const socketIO = require("socket.io");
const createMessage = require("./src/helpers/message");
const { getUser, addUser } = require("./src/helpers/user");
const io = socketIO(server);
const port = 8001;

app.use(express.static(path.join(__dirname, "src")));

io.on("connection", (socket) => {
  socket.on("join-chat", ({ username, userChats }) => {
    const currentUser = addUser(socket.id, username, userChats);
    socket.join(currentUser.userChats);
  });
  socket.on("chat-message", (message) => {
    const currentUser = getUser(socket.id);
    io.to(currentUser.userChats).emit(
      "message",
      createMessage(currentUser.username, message)
    );
  });
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

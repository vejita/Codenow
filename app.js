const http = require("http");
const express = require("express");
const soketio = require("socket.io");
const dotevn = require("dotenv").config();
const formateMessage = require("./util/formateMessage");
const {
  userJoin,
  getCurrentUser,
  getRoomUser,
  userLeave,
} = require("./util/user");

const app = express();

const server = http.createServer(app);
const io = soketio(server);

app.use(express.json());
app.use(express.static("./public"));

const bot = "bot ";

io.on("connection", (soket) => {
  soket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(soket.id, username, room);

    soket.join(user.room);
    // send only to user when he enters
    soket.emit("message", formateMessage(bot, "Welcome to our server"));

    // send to all the users in room
    soket.broadcast
      .to(user.room)
      .emit("message", formateMessage(bot, `${user.username} has joined`));

    // sending user infoo

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUser(user.room),
    });
  });

  // send to all when user left the chat
  soket.on("disconnect", () => {
    const user = userLeave(soket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formateMessage(bot, `${user.username} has left the chat`)
      );

      // sending user infoo
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUser(user.room),
      });
    }
  });

  soket.on("chatMessage", (message) => {
    const user = getCurrentUser(soket.id);
    io.to(user.room).emit(
      "message",
      formateMessage(`${user.username}`, message)
    );
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Lestening on port ${port}...`);
});

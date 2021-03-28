const { createServer } = require("http");
const { config } = require("dotenv");
const { Server } = require("socket.io");
const sequelize = require("./database");

config({ path: `.env.${process.env.NODE_ENV}` });

const app = require("./app");

const server = createServer(app);
const io = new Server(server);

const messages = [];

io.on("connection", (socket) => {
  socket.on("message", (message) => {
    messages.push(message);
    socket.broadcast.emit("message", message);
  });
});

sequelize
  .authenticate()
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.log(error);
  });

server.listen(3000, () => {
  console.log("listening on localhost:3000");
});

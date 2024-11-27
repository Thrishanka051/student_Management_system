const { Server } = require("socket.io");
const http = require("http");
const app = require("./server"); // Import Express app
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Received message:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id} due to ${reason}`);
  });
});

module.exports = io;
module.exports.server = server; // Export the server as well, if needed in your app

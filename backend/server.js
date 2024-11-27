const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const http = require("http"); 
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

// Serve static files in the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 8070;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const url = process.env.MONGODB_URL;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb connection success!");
});

const studentRouter = require("./routes/students");
app.use("/student", studentRouter);

const authRoute = require("./routes/AuthRoute");
app.use("/", authRoute);

const userRoutes = require('./routes/userRoute'); 
app.use('/user', userRoutes);

const subjectRoutes = require ('./routes/subjectRoutes');
app.use('/subject', subjectRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Integrate Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});
// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Example: Handle a custom event
  socket.on("message", (data) => {
    console.log("Received message:", data);
    // Optionally broadcast the message to all connected clients
    io.emit("message", data);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is up and running on port no: ${PORT}`);
});

// Export server and io for external use
module.exports = { io };
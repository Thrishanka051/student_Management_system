const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
require("dotenv").config();

const app = express();

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

app.listen(PORT, () => {
  console.log(`Server is up and running on port no: ${PORT}`);
});
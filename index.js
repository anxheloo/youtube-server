const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./Routes/users");
const commentRoute = require("./Routes/comments");
const videoRoute = require("./Routes/videos");
const authRoute = require("./Routes/auth");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();

// Same as json parser we used cookie parser to send token using cookies
app.use(cookieParser());

// Add this line to parse JSON bodies
app.use(express.json());

const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => console.log("DB CONNECTED"))
    .catch((error) => console.log("THIS IS ERROR:", error));
  // .catch((error) => throw error);
};

app.use("/api/users", userRoute);
app.use("/api/comments", commentRoute);
app.use("/api/videos", videoRoute);
app.use("/api/auth", authRoute);

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";

  res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
});

app.listen(5001, () => {
  connect();
  console.log("CONNCETED");
});

//1.We create a node project using npm init
//2.We install : npm install express mongoose nodemon
//3.We add the script start in package.json so we can use npm start intead of "node index": "start": "nodemon index.js",
//4.We import express, mongoose , we create the app using express , listen to our port we have configured.
//5.To hide our mongo conncetion string, we create .env file and add there what we dont want to share,
//than we install: npm install dotenv and than we import it and use config() method to make it work.
// TO access strings or variables inside the .env we use: process.env."name of variable"

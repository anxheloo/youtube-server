const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./Routes/users");
const videoRoute = require("./Routes/comments");
const commentRoute = require("./Routes/videos");
const authRoute = require("./Routes/auth");

const app = express();
dotenv.config();

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

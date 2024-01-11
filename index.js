const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // npm install dotenv
const userRoute = require("./Routes/users");
const commentRoute = require("./Routes/comments");
const videoRoute = require("./Routes/videos");
const authRoute = require("./Routes/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // cors configuration
const compression = require("compression"); // used for deployment to compress the routes

const app = express();
dotenv.config();

// Compress all routes
app.use(compression());

// Add this line to configure cors
app.use(
  cors({
    // origin: "http://192.168.1.236:3000",
    // origin: "http://localhost:3000",
    // origin: "http://172.30.160.1:3000",
    // origin: "https://inquisitive-gnome-eee029.netlify.app/",
    // credentials: true, // Set to true to pass the header, otherwise it is omitted.
    // exposedHeaders: ["Set-Cookie"],

    origin: "https://glittering-gecko-f41e0f.netlify.app",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

// Add this line to parse JSON bodies
app.use(express.json());

// Same as json parser we used cookie parser to send token using cookies.  npm install cookie-parser
app.use(cookieParser());

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

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
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

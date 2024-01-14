//1. To create a user we define the functions and than we need to import "mongoose" to communicate with mongodb

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const createError = require("../error");
const jwt = require("jsonwebtoken");

module.exports = {
  //for the error we can use the default way of simply catching the error or we use next() and include the global error file.
  //if we use next and global error, we need to define the middleware of catching errors in the index.js file.
  createUser: async (req, res, next) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(401).json("User already exists, please log in!");
      }

      console.log("Request body:", req.body); // Add this line for debugging

      // Generate a salt
      const saltRounds = 10; // You can adjust the number of rounds based on your security needs
      const salt = await bcrypt.genSalt(saltRounds);

      // Hash the password with the generated salt
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      console.log("New user:", newUser); // Add this line for debugging

      await newUser.save();

      res
        .status(201)
        .json({ message: "user created successfully", user: newUser });
    } catch (error) {
      console.error("Error creating user: ", error);
      res.status(500).json({
        success: false,
        status: 500,
        message: "Something went wrong!",
        error: error,
      });

      // next(createError.createError(404, "not found sorry!"));
      // next(createError.createError(500, "Something went wrong!"));
      // next(error);
    }
  },

  login: async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (!existingUser) {
        return res.status(404).json("User not found!");
      }

      const decryptedPassword = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );

      if (decryptedPassword) {
        // Passwords match, you can proceed with login logic

        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET);

        // Create a new object without the 'password' field, both ways below work.
        const { password, ...userWithoutPassword } = existingUser._doc;
        // const { password, ...userWithoutPassword } = existingUser.toObject();

        console.log("THis is user:", existingUser._doc);

        return res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: true, // Also set secure for HTTPS environments
            sameSite: "None",
            // domain: "https://vermillion-gumdrop-dcc65b.netlify.app/",
            //   maxAge: 86400000, // Cookie will expire in 24 hours
            //   // sameSite: "Lax",
            //   // path: "/",
          })
          .status(200)
          .json({
            message: "Login successful",
            user: userWithoutPassword,
            token: token,
          });
      } else {
        // Passwords do not match
        return res
          .status(401)
          .json("Wrong credentials, provide a valid password");
      }
    } catch (error) {
      console.error("Error during login: ", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  google: async (req, res) => {
    try {
      //1.We first try to find the user by email
      const existingUser = await User.findOne({ email: req.body.email });

      console.log("This is existingUser:", existingUser);

      //2.If it exists sign the token, set the cookie and return the status and json with user, message and token
      if (existingUser) {
        const token = await jwt.sign(
          { id: existingUser._id },
          process.env.SECRET
        );

        return res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: true, // Also set secure for HTTPS environments
            sameSite: "None",
            // domain: "https://vermillion-gumdrop-dcc65b.netlify.app/", // Set to your Netlify domain
            // maxAge: 86400000, // Cookie will expire in 24 hours
            // sameSite: "Lax",
            // path: "/",
          })
          .status(200)
          .json({
            message: "Login successful",
            user: existingUser._doc,
            token: token,
            // domain: "https://vermillion-gumdrop-dcc65b.netlify.app/",
          });
      } else {
        //3.Of use not exists, create the user, save it, sign the token and return everything else

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          img: req.body.photoURL,
          fromGoogle: true,
        });

        console.log("This is new User:", newUser);

        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.SECRET);

        console.log("Saved user.id:", savedUser._id);

        return res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: true, // Also set secure for HTTPS environments
            sameSite: "None",
            // maxAge: 86400000, // Cookie will expire in 24 hours
            // sameSite: "Lax",
            // path: "/",
          })
          .status(200)
          .json({
            message: "User Created successful, logged in!",
            user: savedUser._doc,
            token: token,
          });
      }
    } catch (error) {
      console.error("Error during login: ", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: `This is error:${error}`,
      });
    }
  },
};

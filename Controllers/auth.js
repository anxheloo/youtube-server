//1. To create a user we define the functions and than we need to import "mongoose" to communicate with mongodb

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/User");

module.exports = {
  createUser: async (req, res) => {
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
      res.status(500).json({ message: error });
    }
  },

  login: async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });

      if (!existingUser) {
        return res.status(401).json("Wrong credentials, provide a valid email");
      }

      const decryptedPassword = await bcrypt.compare(
        req.body.password,
        existingUser.password
      );

      if (decryptedPassword) {
        // Passwords match, you can proceed with login logic
        return res
          .status(200)
          .json({ message: "Login successful", user: existingUser });
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

  google: (req, res) => {
    try {
    } catch (error) {}
  },
};

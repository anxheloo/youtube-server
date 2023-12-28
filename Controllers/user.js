const bcrypt = require("bcrypt");

const User = require("../models/User");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const existingUsers = await User.find();

      res.status(200).json({ message: "This are users:", existingUsers });
    } catch (error) {
      console.log("This is error:", error);
      res.status(500).json({ message: error });
    }
  },

  getUserById: async (req, res) => {
    try {
      console.log("this is userID :", req.params);
      const userId = req.params.id;

      const existingUser = await User.findById(userId);

      if (!existingUser) {
        res
          .status(401)
          .json({ message: "User with id ${userId} doesnt exists!" });
      }

      res.status(200).json({ message: "THis is your user:", existingUser });
    } catch (error) {
      console.log("THis is error:", error);

      res.status(500).json({ error: error });
    }
  },
};

const User = require("../models/User");

module.exports = {
  // get all users
  getAllUsers: async (req, res) => {
    try {
      const existingUsers = await User.find();

      res.status(200).json({ message: "This are users:", existingUsers });
    } catch (error) {
      console.log("This is error:", error);
      res.status(500).json({ message: error });
    }
  },

  // get user by id
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

  // update a user
  updateUser: async (req, res) => {
    if (req.params.id === req.user.id) {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );

        res.status(200).json({
          message: "User successfully updated",
          updatedUser: updatedUser,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Something went Wrong!", error: error });
      }
    } else {
      return res
        .status(403)
        .json({ message: "You can update only your account!" });
    }
  },

  // delete a user
  deleteUser: async (req, res) => {
    if (req.params.id === req.user.id) {
      console.log(
        "this is req.params.id,",
        req.params.id,
        "this is req.user.id:",
        req.user.id
      );
      try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
          message: "User successfully deleted!",
          deletedUser: deletedUser,
        });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Something went Wrong!", error: error });
      }
    } else {
      return res
        .status(403)
        .json({ message: "You can delete only your account!" });
    }
  },

  // subscribe a user
  subscribeUser: async (req, res) => {
    console.log("Inside subscribeUser");

    try {
      await User.findByIdAndUpdate(req.user.id, {
        $push: { subscribedUsers: req.params.id },
      });

      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: 1 },
      });

      res.status(200).json({ message: "Subscription succesfull!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!", error });
    }
  },

  // unsubscribe a user
  unsubscribeUser: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },
      });

      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });

      res.status(200).json("Subscription succesfull!");
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
  },

  // like a video
  likeVideo: (req, res) => {},

  //dislike a video
  dislikeVideo: (req, res) => {},
};

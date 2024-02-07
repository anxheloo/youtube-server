const User = require("../models/User");
const Video = require("../models/Video");

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

      console.log("this is existingUser:", existingUser);

      if (existingUser) {
        const { password, ...userWithoutPassword } = existingUser._doc;

        console.log("this is userWithoutPassword :", userWithoutPassword);

        res
          .status(200)
          .json({ message: "THis is your user:", userWithoutPassword });
      }

      if (!existingUser) {
        res
          .status(401)
          .json({ message: "User with id ${userId} doesnt exists!" });
      }
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
      const existingUser = await User.findByIdAndUpdate(
        req.user.id,

        // { $addToSet: { subscribedUsers: req.params.id }, },
        {
          $push: { subscribedUsers: req.params.id },
        },
        { new: true }
      );

      console.log("Inside subscribe, existinguser:", existingUser);

      const existingChannel = await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: 1 },
      });

      console.log("Inside subscribe, existingChannel:", existingChannel);

      const { password, ...userWithoutPassword } = existingUser._doc;

      res.status(200).json({
        message: "Subscription succesfull!",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong!", error });
    }
  },

  // unsubscribe a user
  unsubscribeUser: async (req, res) => {
    try {
      const existingUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: { subscribedUsers: req.params.id },
        },
        { new: true }
      );

      console.log("Inside unsubscribe, existinguser:", existingUser);

      const existingChannel = await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });

      console.log("Inside unsubscribe, existingChannel:", existingChannel);

      const { password, ...userWithoutPassword } = existingUser._doc;

      res.status(200).json({
        message: "UnSubscription succesfull!",
        user: userWithoutPassword,
      });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
  },

  // like a video
  likeVideo: async (req, res) => {
    const userId = req.user.id;
    const videoId = req.params.videoId;

    try {
      const video = await Video.findByIdAndUpdate(
        videoId,
        { $addToSet: { likes: userId }, $pull: { dislikes: userId } }, //makes sure the id is in the array only once, instead of using $push where it will push even if it is dublicated value

        { new: true }
      );

      res.json({
        status: 200,
        message: "The Like has been added!",
        video: video,
      });
    } catch (error) {
      res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  //dislike a video
  dislikeVideo: async (req, res) => {
    const userId = req.user.id;
    const videoId = req.params.videoId;

    try {
      const video = await Video.findByIdAndUpdate(
        videoId,
        { $pull: { likes: userId }, $addToSet: { dislikes: userId } }, //makes sure the id is in the array only once, instead of using $push where it will push even if it is dublicated value
        { new: true }
      );

      res.json({
        status: 200,
        message: "The Dislike has been added!",
        video: video,
      });
    } catch (error) {
      res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },
};

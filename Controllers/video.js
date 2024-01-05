const Video = require("../models/Video");
const User = require("../models/User");

module.exports = {
  postVideo: async (req, res) => {
    // const newVideo = new Video({
    //   userId: req.user.id,
    //   title: req.body.title,
    //   description: req.body.description,
    //   videoImg: req.body.videoImg,
    //   videoUrl: req.body.videoUrl,
    // });
    const newVideo = new Video({
      userId: req.user.id,
      ...req.body,
    });

    try {
      const saveVideo = await newVideo.save();

      return res.json({
        status: 200,
        message: "New video saved!",
        video: saveVideo,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong posting video!",
        error: error,
      });
    }
  },

  updateVideo: async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);

      if (!video) {
        return res.json({ status: 404, message: "Video not found!" });
      }

      if (req.user.id === req.params.id) {
        const updatedVideo = await Video.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );

        res.status(200).json({
          message: "Video successfully updated!",
          updatedVideo: updatedVideo,
        });
      } else {
        return res.json({
          status: 404,
          message: "You can update only your video",
        });
      }
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);

      if (!video) {
        return res.json({ status: 404, message: "Video not found!" });
      }

      if (req.user.id === req.params.id) {
        await Video.findByIdAndDelete(req.params.id);

        res.status(200).json({
          message: "Video successfully deleted!",
        });
      } else {
        return res.json({
          status: 404,
          message: "You can delete only your video",
        });
      }
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  getVideo: async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);

      console.log("this is video:", video);

      if (!video) {
        return res.json({ status: 404, message: "Video not found!" });
      }

      return res.status(200).json({
        video,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  addView: async (req, res) => {
    try {
      const video = await Video.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
      );

      // if (!video) {
      //   return res.json({ status: 404, message: "Video not found!" });
      // }

      res.status(200).json({ message: "The view has been increased!" });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  random: async (req, res) => {
    try {
      const video = await Video.aggregate([{ $sample: { size: 40 } }]);

      res.status(200).json({
        video,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  subscribedChannelVideos: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const subscribedChannels = user.subscribedUsers;

      console.log("this is subscribedChannels:", subscribedChannels);

      const list = await Promise.all(
        subscribedChannels.map((channelId) => {
          return Video.find({ userId: channelId });
        })
      );

      console.log("This is list:", list);

      return res.status(200).json({
        list,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  trend: async (req, res) => {
    try {
      const videos = await Video.find().sort({ views: -1 });

      // if (!video) {
      //   return res.json({ status: 404, message: "Video not found!" });
      // }

      res.status(200).json({
        videos,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },
};

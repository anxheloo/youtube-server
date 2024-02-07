const Video = require("../models/Video");
const User = require("../models/User");

const express = require("express");

module.exports = {
  //create video
  postVideo: async (req, res) => {
    const { title, description } = req.body;
    console.log("This is title, description:", title, description);

    let imageFilename = null;
    let imagePath = null;

    try {
      const file = req.files;
      console.log("this is file:", file);

      const filename = req.files.video[0].filename;
      console.log("This is filename:", filename);

      const videoPath = req.files.video[0].path;
      console.log("This is videoPath:", videoPath);

      if (req.files.image) {
        imageFilename = req.files.image[0].filename;
        imagePath = req.files.image[0].path;
      }

      console.log("This is image filename:", imageFilename);
      console.log("This is image path:", imagePath);

      const video = new Video({
        userId: "",
        title: title,
        description: description,
        videoImg: "",
        filename: filename,
        videoUrl: videoPath,
      });
      console.log("This is video:", video);
      await video.save();
      res.status(200).json({
        message: "Video saved successfully!",
        "This is your video:": video,
      });
    } catch (error) {
      res.status(400).json({ message: "Video upload failed", error });
      console.log(error);
    }
  },

  // update video
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

  //delete the video
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

  getAllVideos: async (req, res) => {
    try {
      const videos = await Video.find();

      return res.status(200).json({
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

  //get the video
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

  // add video view on the video
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

  //get random videos
  random: async (req, res) => {
    try {
      const videos = await Video.aggregate([{ $sample: { size: 20 } }]);

      // console.log("These are videos:", videos)

      res.json({
        status: 200,
        message: "These are random videos!",
        videos: videos,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  //get subscribed videos of the current logged in user
  subscriptions: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      const subscribedChannels = user.subscribedUsers;

      console.log("this is subscribedChannels:", subscribedChannels);

      const list = await Promise.all(
        subscribedChannels.map(async (channelId) => {
          const videos = await Video.find({ userId: channelId });
          return videos;
        })
      );

      // console.log("This is list:", list.flat());

      return res.json({
        status: 200,
        videos: list.flat().sort((a, b) => b.createdAt - a.createdAt), // sort from latest
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

      res.json({
        status: 200,
        message: "These are trends videos!",
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

  // get video by title
  search: async (req, res) => {
    const query = req.query.q;

    try {
      //1.Using atlas search index
      // const result = await Video.aggregate([
      //   {
      //     $search: {
      //       index: "youtube-prova",
      //       text: {
      //         query: query,
      //         path: {
      //           wildcard: "*",
      //         },
      //       },
      //     },
      //   },
      // ]);

      // return res.json(result);

      //2.Using regex
      const videos = await Video.find({
        title: { $regex: query, $options: "i" },
      }).limit(40);

      console.log(videos);

      if (videos.length === 0) {
        return res.json({ status: 404, message: "Video not found" });
      }

      return res.json(videos);
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },

  //get videos by tags
  getByTag: async (req, res) => {
    const tags = req.query.tags.split(",");
    console.log(tags);

    try {
      const videos = await Video.find({ tags: { $in: tags } }).limit(20);

      console.log(videos);

      if (videos.length === 0) {
        return res.json({
          status: 404,
          message: "There are no videos with these tags!",
        });
      }

      return res.json(videos);
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something went wrong!",
        error: error,
      });
    }
  },
};

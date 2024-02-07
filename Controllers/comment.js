const Comment = require("../models/Comments");
const Video = require("../models/Video");

module.exports = {
  createComment: async (req, res) => {
    const userId = req.user.id;

    try {
      const newComment = new Comment({
        userId,
        videoId: req.body.videoId,
        description: req.body.description,
      });

      await newComment.save();

      return res.json({
        status: 200,
        message: "Comment created successfully!",
        comment: newComment,
      });
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something wrong!",
        error: error,
      });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findById(res.params.id);
      const video = await Video.findById(res.params.id);

      if (req.user.id === comment.userId || req.user.id === video.userId) {
        await Comment.findByIdAndDelete(req.params.id);

        return res.json({
          status: 200,
          message: "Comment deleted successfully!",
        });
      } else {
        return res.json({
          error: 403,
          message: "You can delete only your comment!",
        });
      }
    } catch (error) {
      return res.json({
        status: 500,
        message: "Something wrong!",
        error: error,
      });
    }
  },

  getComments: async (req, res) => {
    try {
      const getComments = await Comment.find({ videoId: req.params.videoId });

      if (getComments.length === 0) {
        return res.json({ status: 404, message: "THere are no comments!" });
      }

      console.log("this is getComments:", getComments);

      const comments = await getComments.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      console.log("this is comments:", comments);

      return res.json({
        status: 200,
        message: "Comments are ready!",
        comments,
      });
    } catch (error) {
      console.log("this is error:", error);
      return res.json({
        status: 500,
        message: "Something wrong!",
        error: error,
      });
    }
  },
};

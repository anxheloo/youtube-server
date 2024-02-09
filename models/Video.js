const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    videoImg: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      trim: true,
    },

    views: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: [String],
      default: [],
    },
    dislikes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", VideoSchema);

const express = require("express");
const videoController = require("../Controllers/video");
const { verifyToken } = require("../verifyToken");

const router = express.Router();

router.get(
  "/subscribed-channel-videos",
  verifyToken,
  videoController.subscribedChannelVideos
);
router.post("/", verifyToken, videoController.postVideo);
router.put("/:id", verifyToken, videoController.updateVideo);
router.get("/:id", verifyToken, videoController.getVideo);
router.delete("/:id", verifyToken, videoController.deleteVideo);
router.put("/view/:id", videoController.addView);
router.get("/trend", videoController.trend);
router.get("/random", videoController.random);

module.exports = router;

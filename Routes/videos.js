const express = require("express");
const videoController = require("../Controllers/video");
const { verifyToken } = require("../verifyToken");

const router = express.Router();

router.post("/subscriptions", verifyToken, videoController.subscriptions);
// router.get("/subscriptions", verifyToken, videoController.subscriptions);
router.post("/trend", videoController.trend);
// router.get("/trend", videoController.trend);
router.post("/random", videoController.random);
// router.get("/random", videoController.random);
router.get("/tags", videoController.getByTag);
router.get("/search", videoController.search);
router.post("/", verifyToken, videoController.postVideo);
router.put("/:id", verifyToken, videoController.updateVideo);
router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideo);
router.delete("/:id", verifyToken, videoController.deleteVideo);
router.put("/view/:id", videoController.addView);

module.exports = router;

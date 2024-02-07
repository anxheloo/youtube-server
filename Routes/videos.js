const express = require("express");
const videoController = require("../Controllers/video");
const { verifyToken } = require("../verifyToken");

const router = express.Router();

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "../files");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// upload.fields(["image","video"])

router.get("/", videoController.getAllVideos);
router.get("/tags", videoController.getByTag);
router.get("/search", videoController.search);
router.get("/:id", videoController.getVideo);
router.post(
  "/",
  //   verifyToken,
  //   upload.single("file"),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  videoController.postVideo
);
router.post("/subscriptions", verifyToken, videoController.subscriptions);
// router.get("/subscriptions", verifyToken, videoController.subscriptions);
router.post("/trend", videoController.trend);
// router.get("/trend", videoController.trend);
router.post("/random", videoController.random);
// router.get("/random", videoController.random);
router.delete("/:id", verifyToken, videoController.deleteVideo);
router.put("/:id", verifyToken, videoController.updateVideo);
router.put("/view/:id", videoController.addView);

module.exports = router;

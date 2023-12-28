const express = require("express");
const videoController = require("../Controllers/video");

const router = express.Router();

router.get("/test", videoController.test);

module.exports = router;

const express = require("express");
const commentController = require("../Controllers/comment");

const router = express.Router();

router.get("/test", commentController.test);

module.exports = router;

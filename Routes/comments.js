const express = require("express");
const commentController = require("../Controllers/comment");

const { verifyToken } = require("../verifyToken");

const router = express.Router();

router.get("/:videoId", commentController.getComments);
router.post("/", verifyToken, commentController.createComment);
router.delete("/:id", verifyToken, commentController.deleteComment);

module.exports = router;

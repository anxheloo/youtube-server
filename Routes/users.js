const express = require("express");
const userController = require("../Controllers/user");
const { verifyToken } = require("../verifyToken");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);
router.put("/subscribe/:id", verifyToken, userController.subscribeUser);
router.put("/unsubscribe/:id", verifyToken, userController.unsubscribeUser);
router.put("/like/:videoId", verifyToken, userController.likeVideo);
router.put("/dislike/:videoId", verifyToken, userController.dislikeVideo);

module.exports = router;

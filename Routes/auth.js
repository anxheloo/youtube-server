const express = require("express");
const authController = require("../Controllers/auth");

const router = express.Router();

//CREATE A USER

router.post("/signup", authController.createUser);

//SIGN IN

router.post("/login", authController.login);

//GOOGLE AUTH

router.post("/google", authController.google);

module.exports = router;

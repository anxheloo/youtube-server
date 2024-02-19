const jwt = require("jsonwebtoken"); //npm install jsonwebtoken

module.exports = {
  verifyToken: async (req, res, next) => {
    const token = req.cookies.access_token;

    // const token = req.body.token;
    // console.log("This is req.body:", req.body);

    // const authHeader = req.headers["authorization"];
    // const token = authHeader && authHeader.split(" ")[1]; // Extracting the token from the header

    // console.log("THESE is req.cookies:", req.cookies);
    console.log("This is token!:", token);

    if (!token) {
      return res.status(401).json("You are not authenticated");
    }

    jwt.verify(token, process.env.SECRET, async (err, user) => {
      if (err) {
        console.log("This is error:", err);
        return res.status(403).json("Invalid token!");
      }
      req.user = user;
      console.log("Inside verifyTOken:", req.user);
      next();
    });
  },
};

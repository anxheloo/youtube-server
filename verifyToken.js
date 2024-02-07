const jwt = require("jsonwebtoken"); //npm install jsonwebtoken

module.exports = {
  verifyToken: async (req, res, next) => {
    console.log("entering verify token");
    // const token = req.cookies.access_token;
    const token = req.body.token;

    // const token = req.cookie.access_token;

    console.log("THis is req.body:", req.body);
    // console.log("THESE is req.cookies:", req.cookies);
    console.log("This is token!:", token);
    console.log("Token type:", typeof token);
    // console.log("THis is req:", req);

    if (!token) {
      return res.status(401).json("You are not authenticated");
    }

    jwt.verify(token, process.env.SECRET, async (err, user) => {
      if (err) {
        return res.status(403).json("Invalid token!");
      }
      req.user = user;
      next();
    });
  },
};

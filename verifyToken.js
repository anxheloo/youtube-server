const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.cookies.access_token;

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

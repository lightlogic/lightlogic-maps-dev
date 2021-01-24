const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // headers will have been constructed using
    // the pattern "Bearer My-token-aosdifj3"
    // thus the split and second approch process below
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};

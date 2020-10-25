
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json("Access denied...No token provided...");
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (er) {

    res.clearCookie("token");
    return res.status(400).json(er.message);
  }
};
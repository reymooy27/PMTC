const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  console.log(token);

  if (!token) return res.status(401).json({ msg: "Tidak Dapat Diakses" });
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ msg: "Invalid Token" });
  }
};

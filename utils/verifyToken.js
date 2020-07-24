const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  let bearerToken = req.headers["authorization"];

  if (!bearerToken) return res.status(401).json({ msg: "Tidak Dapat Diakses" });

  try {
    if (typeof bearerToken !== "undefined") {
      const bearer = bearerToken.split(" ");
      const token = bearer[1];

      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      await next();
    } else {
      res.status(500).json({ msg: "Invalid Token" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Invalid Token" });
  }
};

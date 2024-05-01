const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(
    token,
    "0a3f4c10b827cced2e5e8f45f3f3d14b2dd634f3c1558055b0b51e43dcecbade",
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = user;
      next();
    }
  );
}

module.exports = authenticateToken;

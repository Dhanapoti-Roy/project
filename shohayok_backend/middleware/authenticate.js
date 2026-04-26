const { verifyAccessToken } = require("../utils/token");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};
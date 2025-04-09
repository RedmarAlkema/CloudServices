const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const gatewayKey = req.headers["x-gateway-key"];
  if (gatewayKey !== process.env.GATEWAY_KEY) {
    return res.status(403).json({ msg: "Niet geautoriseerd: Geen toegang zonder Gateway" });
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "Geen token meegegeven" });

  const token = authHeader.split(" ")[1];

  console.log("🔐TARGET Binnengekomen token:", token);
  console.log("🔑TARGET JWT_SECRET in .env:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Target: Token is ongeldig" });
  }
};

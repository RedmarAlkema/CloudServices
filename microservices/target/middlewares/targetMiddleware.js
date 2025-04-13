const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const gatewayKey = req.headers["x-gateway-key"];
  if (gatewayKey !== process.env.GATEWAY_KEY) {
    return res.status(403).json({ msg: "Niet geautoriseerd: Geen toegang zonder Gateway" });
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "Geen token meegegeven" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.method === 'POST' || req.method === 'DELETE') {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: "Niet geautoriseerd: Alleen admins mogen deze actie uitvoeren" });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Target: Token is ongeldig" });
  }
};

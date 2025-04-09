const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  console.log("dit zijn de headers auth: ", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(403).json({ message: 'Token ontbreekt' });

  const token = authHeader.split(' ')[1];

  console.log("🔐AUTH Binnengekomen token:", token);
  console.log("🔑AUTH JWT_SECRET in .env:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Auth: Token is ongeldig' });
  }
};

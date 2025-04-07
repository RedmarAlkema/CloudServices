const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async ({ username, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword, role });
  await user.save();
  return user;
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('Gebruiker niet gevonden');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Wachtwoord klopt niet');

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
};

module.exports = { register, login };
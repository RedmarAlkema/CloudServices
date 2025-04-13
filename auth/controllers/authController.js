const authService = require('../services/authService');
const producer = require('../services/producer'); 

exports.registerUser = async (req, res) => {
  try {
    const user = await authService.register(req.body);

    await producer.publishUserEmail(user);

    res.status(201).json({ message: 'Gebruiker aangemaakt', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const targetService = require('../services/targetService');

exports.getAllTargets = async (req, res) => {
  try {
    const targets = await targetService.getAllTargets();
    res.status(200).json(targets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
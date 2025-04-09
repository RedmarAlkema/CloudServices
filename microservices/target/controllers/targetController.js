const targetService = require("../services/targetService");
const Target = require('../models/Target');
const { publishTargetCreated } = require('../services/messageQueue');

exports.createTarget = async (req, res) => {
    try {
      const target = new Target({ ...req.body, ownerId: req.user.userId });
      await target.save();

      await publishTargetCreated(target);

      res.status(201).json(target);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getAllTargets = async (req, res) => {
  try {
    const targets = await targetService.getAll();
    res.status(200).json(targets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTarget = async (req, res) => {
  try {
    const result = await targetService.delete(req.params.id, req.user.id);
    res.status(result.status).json({ message: result.message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
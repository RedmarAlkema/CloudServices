const Target = require("../models/Target");

exports.getAllTargets = async (req, res) => {
  try {
    const query = {};

    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }
    if (req.query.location) {
      query.location = { $regex: req.query.location, $options: 'i' }; 
    }
    if (req.query.radius) {
      query.radius = req.query.radius;
    }
    if (req.query.deadline) {
      query.deadline = { $lte: new Date(req.query.deadline) }; 
    }

    const targets = await Target.find(query);
    res.status(200).json(targets);
  } catch (err) {
    console.error("Fout bij ophalen van targets:", err.message);
    res.status(500).json({ message: "Er is iets fout gegaan" });
  }
};

exports.getTargetById = async (req, res) => {
  try {
    const target = await Target.findOne({ targetId: req.params.id });
    if (!target) return res.status(404).json({ message: "Target niet gevonden" });

    const formatted = {
      ...target.toObject(),
      img: target.img?.data
        ? `data:${target.img.contentType};base64,${target.img.data.toString("base64")}` 
        : null
    };

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
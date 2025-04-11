const Target = require("../models/Target");

exports.getAllTargets = async (req, res) => {
  try {
    const targets = await Target.find();

    const formatted = targets.map(t => ({
      ...t.toObject(),
      img: t.img?.data
        ? `data:${t.img.contentType};base64,${t.img.data.toString("base64")}`
        : null
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTargetById = async (req, res) => {
  try {
    const target = await Target.findById(req.params.id);
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
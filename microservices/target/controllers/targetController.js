const Target = require('../models/Target');
const { publishTargetCreated } = require('../services/messageQueue');

exports.createTarget = async (req, res) => {
  try {
    const { title, location, description, radius, deadline } = req.body;

    let imageFile = null;
    if (req.files && req.files.length > 0) {
      imageFile = req.files.find(f => f.fieldname === "img");
    }

    const target = new Target({
      title,
      location,
      description,
      radius,
      deadline,
      ownerId: req.user.userId,
      img: imageFile ? {
        data: imageFile.buffer,
        contentType: imageFile.mimetype
      } : undefined
    });

    await target.save();
    await publishTargetCreated(target);

    res.status(201).json(target);
  } catch (err) {
    console.error("❌ Fout bij aanmaken target:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.getAllTargets = async (req, res) => {
  try {
    const targets = await Target.find();

    const formattedTargets = targets.map(t => ({
      ...t.toObject(),
      img: t.img?.data 
        ? `data:${t.img.contentType};base64,${t.img.data.toString('base64')}`
        : null
    }));

    res.status(200).json(formattedTargets);
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
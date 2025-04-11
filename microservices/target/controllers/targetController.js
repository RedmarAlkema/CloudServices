const Target = require('../models/Target');

exports.getTargetFromRequest = async (req) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Geen bestand meegegeven' });
    }

    const file = req.files[0]; 

    const { title, location, description, radius, deadline } = req.body;

    const newTarget = new Target({
      title,
      location,
      description,
      img: {
        data: file.buffer,
        contentType: file.mimetype
      },
      radius,
      deadline,
      ownerId: req.user.userId
    });
  
  return newTarget;

} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Er is iets fout gegaan bij het uploaden' });
}
};

exports.uploadTarget = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Geen bestand meegegeven' });
    }

    const file = req.files[0]; 

    const { title, location, description, radius, deadline } = req.body;

    const newTarget = new Target({
      title,
      location,
      description,
      img: {
        data: file.buffer,
        contentType: file.mimetype
      },
      radius,
      deadline,
      ownerId: req.user.userId
    });

    await newTarget.save();
    res.status(201).json({ message: 'Bestand succesvol geüpload', file: newTarget });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Er is iets fout gegaan bij het uploaden' });
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
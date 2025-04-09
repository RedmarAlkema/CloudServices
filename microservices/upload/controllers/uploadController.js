const Upload = require('../models/upload');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Geen bestand meegegeven' });
    }

    const { userId, targetId } = req.body;

    const newUpload = new Upload({
      filename: req.file.originalname,
      img: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      },
      userId: req.user.userId,
      targetId,
      contentType: req.file.mimetype
    });

    await newUpload.save();

    res.status(201).json({ message: 'Bestand succesvol geüpload', file: newUpload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Er is iets fout gegaan bij het uploaden' });
  }
};

module.exports = {
  uploadFile
};
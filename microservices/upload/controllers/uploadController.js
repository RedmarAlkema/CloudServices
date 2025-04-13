const Upload = require('../models/upload');
const mongoose = require('mongoose');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Geen bestand meegegeven' });
    }

    const { userId, targetId } = req.body;
    const uploadId = new mongoose.Types.ObjectId();

    const newUpload = new Upload({
      uploadId,
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

const getUploadFromRequest = async (req) => {
  try {
    const file = req.file || (req.files && req.files[0]);

    if (!file) {
      throw new Error('Geen bestand meegegeven');
    }

    const uploadId = new mongoose.Types.ObjectId();
    const { targetId, contentType } = req.body;

    const newUpload = new Upload({
      uploadId,
      filename: file.originalname,
      img: {
        data: file.buffer,
        contentType: file.mimetype
      },
      userId: req.user.userId,     
      targetId,
      contentType: contentType || file.mimetype
    });

    return newUpload;

  } catch (error) {
    console.error(error);
    throw new Error("Er is iets fout gegaan bij het verwerken van de upload");
  }
};

  const deleteUpload = async (req, res) => {
  const { uploadId } = req.params;

  try {
    const deleted = await Upload.findOneAndDelete({ uploadId: uploadId });

    if (!deleted) {
      return res.status(404).json({ message: "Upload niet gevonden" });
    }

    return res.status(200).json({ message: "Upload succesvol verwijderd" });
  } catch (err) {
    console.error("Fout bij verwijderen upload:", err.message);
    return res.status(500).json({ message: "Interne serverfout" });
  }
};



module.exports = {
  uploadFile,
  getUploadFromRequest,
  deleteUpload
};
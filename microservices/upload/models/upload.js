const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  img: {
    data: Buffer,
    contentType: String
  },
  userId: { type: String, required: true },
  targetId: { type: String, required: true },
  contentType: { type: String },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', uploadSchema);
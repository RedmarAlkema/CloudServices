const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  imageUrl: String,
  deadline: Date,
  ownerId: String
}, { timestamps: true });

module.exports = mongoose.model('Target', targetSchema);
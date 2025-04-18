const mongoose = require("mongoose");

const targetSchema = new mongoose.Schema({
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  title: String,
  location: String,
  description: String,
  img: {
    data: Buffer,
    contentType: String,
  },
  radius: Number,
  deadline: Date,
  ownerId: String,
}, { timestamps: true });

module.exports = mongoose.model("Target", targetSchema);
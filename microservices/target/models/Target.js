const mongoose = require("mongoose");

const targetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  img: {
    data: Buffer,
    contentType: String
  },
  radius: { type: Number, required: true },
  deadline: { type: Date, required: true },
  ownerId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Target", targetSchema);
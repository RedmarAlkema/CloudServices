const mongoose = require('mongoose');

const clockSchema = new mongoose.Schema({
  targetId: { type: String, required: true },
  deadline: { type: Date, required: true },
});

const Clock = mongoose.model('Clock', clockSchema);

module.exports = Clock;
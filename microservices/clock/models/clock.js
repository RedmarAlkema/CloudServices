const mongoose = require('mongoose');

const clockSchema = new mongoose.Schema({
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  deadline: { type: Date, required: true },
});

const Clock = mongoose.models.Clock || mongoose.model('Clock', clockSchema);

module.exports = Clock;

const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  details: { type: String, required: true },
  numberPlate: { type: String, required: true, unique: true },
  lastEndOdo: { type: Number, default: 0 },
  status: { type: String, enum: ['Available', 'Engaged'], default: 'Available' },
  files: [{ name: String, size: Number, type: String, timestamp: Date, id: String }],
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);
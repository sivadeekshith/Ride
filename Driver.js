const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contact: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // contact as default
  status: { type: String, enum: ['Available', 'Engaged'], default: 'Available' },
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);
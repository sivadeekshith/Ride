const mongoose = require('mongoose');

const DriverSessionSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('DriverSession', DriverSessionSchema);
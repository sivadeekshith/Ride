const mongoose = require('mongoose');

const EmergencyIncidentSchema = new mongoose.Schema({
  bookingId: { type: Number, required: true },
  driver: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  resolutionNotes: { type: String },
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('EmergencyIncident', EmergencyIncidentSchema);
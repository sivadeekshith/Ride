const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  orderedAt: { type: Date, default: Date.now },
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  employeeContact: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  Passengers: { type: Number, default: 1 },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  timeStart: { type: String, required: true },
  timeEnd: { type: String, required: true },
  isWillingToShare: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed', 'Expired', 'On-Ride'], default: 'Pending' },
  driver: { type: String },
  carPlate: { type: String },
  odoStart: { type: Number },
  odoEnd: { type: Number },
  tripStartTime: { type: Date },
  tripEndTime: { type: Date },
  tripCompletedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
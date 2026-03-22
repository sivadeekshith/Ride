const Booking = require('../models/Booking');
const Driver = require('../models/Driver');
const Car = require('../models/Car');
const EmergencyIncident = require('../models/EmergencyIncident');

// @desc    Get pending bookings
// @route   GET /api/admin/bookings/pending
// @access  Private/Admin
const getPendingBookings = async (req, res, next) => {
  try {
    const pending = await Booking.find({ status: 'Pending' }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve single booking
// @route   POST /api/admin/bookings/approve
// @access  Private/Admin
const approveBooking = async (req, res, next) => {
  try {
    const { bookingId, driver, carPlate } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const driverObj = await Driver.findOne({ name: driver });
    const carObj = await Car.findOne({ numberPlate: carPlate });
    if (!driverObj || driverObj.status === 'Engaged') return res.status(400).json({ error: 'Driver unavailable' });
    if (!carObj || carObj.status === 'Engaged') return res.status(400).json({ error: 'Car unavailable' });

    booking.status = 'Approved';
    booking.driver = driver;
    booking.carPlate = carPlate;
    await booking.save();

    driverObj.status = 'Engaged';
    carObj.status = 'Engaged';
    await driverObj.save();
    await carObj.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Similar for batch approve, reject, driver/car CRUD, reports, emergency...
// Omitted for brevity; follow same pattern.

module.exports = { getPendingBookings, approveBooking /* ... */ };
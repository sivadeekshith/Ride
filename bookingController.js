const Booking = require('../models/Booking');

// @desc    Get my bookings
// @route   GET /api/bookings/my
// @access  Private (employee)
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ employeeName: req.user.username }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (employee)
const createBooking = async (req, res, next) => {
  try {
    const bookingData = { ...req.body, employeeName: req.user.username, status: 'Pending' };
    const booking = await Booking.create(bookingData);
    res.status(201).json({ success: true, id: booking.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (employee)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.employeeName !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (booking.status === 'Pending' || booking.status === 'Approved') {
      booking.status = 'Cancelled';
      await booking.save();
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Cannot cancel booking in current status' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke cancellation
// @route   PUT /api/bookings/:id/revoke
// @access  Private (employee)
const revokeCancellation = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.employeeName !== req.user.username) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (booking.status === 'Cancelled') {
      booking.status = 'Pending';
      booking.driver = null;
      booking.carPlate = null;
      await booking.save();
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Only cancelled bookings can be revoked' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyBookings, createBooking, cancelBooking, revokeCancellation };
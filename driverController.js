const Booking = require('../models/Booking');
const Car = require('../models/Car');
const DriverSession = require('../models/DriverSession');
const EmergencyIncident = require('../models/EmergencyIncident');

// @desc    Get driver's active trips
// @route   GET /api/driver/trips
// @access  Private/Driver
const getDriverTrips = async (req, res, next) => {
  try {
    const trips = await Booking.find({ driver: req.driver.name, status: { $in: ['Approved', 'On-Ride'] } });
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

// @desc    Start trip (save odometer start)
// @route   PUT /api/driver/trip/:id/start
// @access  Private/Driver
const startTrip = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.driver !== req.driver.name) return res.status(403).json({ error: 'Not your trip' });
    if (booking.status !== 'Approved') return res.status(400).json({ error: 'Trip not approved' });

    const car = await Car.findOne({ numberPlate: booking.carPlate });
    if (!car) return res.status(400).json({ error: 'Car not found' });
    const { odometer } = req.body;
    if (odometer < car.lastEndOdo) return res.status(400).json({ error: 'Odometer cannot be less than last recorded' });

    booking.odoStart = odometer;
    booking.status = 'On-Ride';
    booking.tripStartTime = new Date();
    await booking.save();

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    End trip (save odometer end)
// @route   PUT /api/driver/trip/:id/end
// @access  Private/Driver
const endTrip = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.driver !== req.driver.name) return res.status(403).json({ error: 'Not your trip' });
    if (booking.status !== 'On-Ride') return res.status(400).json({ error: 'Trip not started' });

    const { odometer } = req.body;
    if (odometer <= booking.odoStart) return res.status(400).json({ error: 'End odometer must be > start' });

    booking.odoEnd = odometer;
    booking.status = 'Completed';
    booking.tripEndTime = new Date();
    booking.tripCompletedAt = new Date();
    await booking.save();

    const car = await Car.findOne({ numberPlate: booking.carPlate });
    if (car) {
      car.lastEndOdo = odometer;
      car.status = 'Available';
      await car.save();
    }
    const driver = await Driver.findOne({ name: booking.driver });
    if (driver) {
      driver.status = 'Available';
      await driver.save();
    }
    // End driver session
    await DriverSession.findOneAndUpdate(
      { driverName: booking.driver, logoutTime: null },
      { logoutTime: new Date() }
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Report emergency
// @route   POST /api/driver/emergency
// @access  Private/Driver
const reportEmergency = async (req, res, next) => {
  try {
    const { bookingId, type, location, details } = req.body;
    const incident = await EmergencyIncident.create({
      bookingId,
      driver: req.driver.name,
      type,
      location,
      details,
      status: 'Open',
    });
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get driver sessions
// @route   GET /api/driver/sessions
// @access  Private/Driver
const getDriverSessions = async (req, res, next) => {
  try {
    const sessions = await DriverSession.find({ driverName: req.driver.name }).sort({ loginTime: -1 });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// @desc    Record driver login (session start)
// @route   POST /api/driver/session
// @access  Private/Driver
const startSession = async (req, res, next) => {
  try {
    const existing = await DriverSession.findOne({ driverName: req.driver.name, logoutTime: null });
    if (!existing) {
      await DriverSession.create({ driverName: req.driver.name });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    End driver session (logout)
// @route   POST /api/driver/session/end
// @access  Private/Driver
const endSession = async (req, res, next) => {
  try {
    await DriverSession.findOneAndUpdate(
      { driverName: req.driver.name, logoutTime: null },
      { logoutTime: new Date() }
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDriverTrips,
  startTrip,
  endTrip,
  reportEmergency,
  getDriverSessions,
  startSession,
  endSession,
};
const Booking = require("../models/Booking");
const Tour = require("../models/Tour");
const mongoose = require("mongoose");

const createBooking = async (req, res) => {
  try {
    const { tour, clientName, clientEmail, clientPhone, numberOfPeople } = req.body;

    // ✅ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(tour)) {
      return res.status(400).json({ message: "Invalid tour ID format" });
    }

    const tourExists = await Tour.findById(tour);
    if (!tourExists) {
      return res.status(400).json({ message: "Tour not found." });
    }

    const booking = new Booking({
      tour,
      clientName,
      clientEmail,
      clientPhone,
      numberOfPeople,
      status: "pending",
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("tour");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("tour");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};

const Tour = require("../models/Tour");
const Destination = require("../models/Destination");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create tour
const createTour = async (req, res) => {
  try {
    const { title, destination, duration, price, description } = req.body;
    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(400).json({ message: "Invalid destination ID — destination not found." });
    }
    const itinerary = req.body.itinerary ? JSON.parse(req.body.itinerary) : [];
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const tour = new Tour({
      title,
      destination,
      duration,
      price,
      description,
      itinerary,
      imageUrl,
    });

    await tour.save();
    res.status(201).json(tour);
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get all tours
const getTours = async (req, res) => {
  try {
    const tours = await Tour.find().populate("destination");
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tour by ID
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate("destination");
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tour (with optional image)
const updateTour = async (req, res) => {
  try {
    // ✅ If new destination ID is provided, verify it exists
    if (req.body.destination) {
      const destinationExists = await Destination.findById(req.body.destination);
      if (!destinationExists) {
        return res.status(400).json({ message: "Invalid destination ID — destination not found." });
      }
    }
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }
    if (req.body.itinerary) {
      req.body.itinerary = JSON.parse(req.body.itinerary);
    }

    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.status(200).json(updatedTour);
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete tour
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upload,
  createTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
};

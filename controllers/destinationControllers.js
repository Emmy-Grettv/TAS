const Destination = require('../models/Destination');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ uploads/ folder created");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

const createDestination = async (req, res) => {
  try {
    const { name, country, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
    const destination = new Destination({ name, country, description, imageUrl });
    await destination.save();
    console.log("req.body:", req.body);
    res.status(201).json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllDestinations = async (req, res) => {
    try{
        const destinations = await Destination.find();
        res.status(200).json(destinations);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

const getDestinationById = async (req, res) => {
    try{
        const destination = await Destination.findById(req.params.id);  
        if(!destination){
            return res.status(404).json({ message: "Destination not found" });
        }   
        res.status(200).json(destination);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

const updateDestination = async (req, res) => {
  try {
    if (req.file) {
      req.body.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.status(200).json(updatedDestination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDestination = async (req, res) => {
    try{
        const destination = await Destination.findByIdAndDelete(req.params.id);
        if(!destination){
            return res.status(404).json({ message: "Destination not found" });
        }
        res.status(200).json({ message: "Destination deleted successfully" });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    upload,
    createDestination,
    getAllDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination
};

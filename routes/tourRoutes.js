const express = require("express");
const router = express.Router();
const {
  upload,
  createTour,
  getTours,
  getTourById,
  updateTour,
  deleteTour,
} = require("../controllers/tourControllers");

router.post("/createTour/", upload.single("image"), createTour);
router.get("/getAllTours/", getTours);
router.get("/getTourByID/:id", getTourById);
router.put("/updateTour/:id", upload.single("image"), updateTour);
router.delete("/deleteTour/:id", deleteTour);

module.exports = router;

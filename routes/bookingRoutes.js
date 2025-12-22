const express = require("express");

const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.post("/createBookings", bookingController.createBooking);
router.get("/getAllBookings", bookingController.getBookings);
router.get("/getBookingByID/:id", bookingController.getBookingById);
router.put("/updateBooking/:id", bookingController.updateBookingStatus);
router.delete("/deleteBooking/:id", bookingController.deleteBooking);

module.exports = router;

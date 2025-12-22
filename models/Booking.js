const mongoose = require('mongoose');
const Tour = require("./Tour");

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
    validate: {
      validator: async function (value) {
        const exists = await Tour.exists({ _id: value });
        return exists !== null;
      },
      message: "Invalid tour ID — tour not found.",
    },
  },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String },
  bookingDate: { type: Date, default: Date.now },
  numberOfPeople: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);

const mongoose = require("mongoose");
const Destination = require("./Destination");

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
    required: true,
    validate: {
      validator: async function (value) {
        // Check if the referenced destination exists
        const exists = await Destination.exists({ _id: value });
        return exists !== null;
      },
      message: "Invalid destination ID — destination not found.",
    },
  },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  itinerary: [
    {
      day: Number,
      activities: String,
    },
  ],
  imageUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Tour", tourSchema);

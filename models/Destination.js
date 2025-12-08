const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: ''
    },
  },
   { timestamps: true}
);

const Destination = mongoose.model('Destination', destinationSchema);
module.exports = Destination;
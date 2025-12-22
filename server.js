const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const destinationRoutes = require('./routes/destinationRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes')

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected suuccessfully!!!!"))
    .catch((err) => console.error("MongoDB connection error!!", err)
)

app.use('/api/destinations', destinationRoutes);
app.use('/api/tours', tourRoutes)
app.use('/api/bookings', bookingRoutes)

 const PORT = process.env.PORT || 3000;

 app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
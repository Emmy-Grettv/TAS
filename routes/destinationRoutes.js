const express = require('express');
const destinationController = require('../controllers/destinationControllers');

const upload = require('../controllers/destinationControllers').upload;

const router = express.Router();

router.post('/createDestinations', destinationController.upload.single("image"), destinationController.createDestination);
router.get('/getAllDestinations', destinationController.getAllDestinations);        
router.get('/getDestinationsByID/:id', destinationController.getDestinationById);
router.put('/updateDestinations/:id', destinationController.upload.single("image"), destinationController.updateDestination);
router.delete('/deleteDestinations/:id', destinationController.deleteDestination);
module.exports = router;
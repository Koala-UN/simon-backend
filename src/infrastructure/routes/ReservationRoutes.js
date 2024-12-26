const express = require('express');
const reservationController = require('../controllers/ReservationController');

const router = express.Router();

// Rutas de reservas
router.get('/', reservationController.getAllReservations);

module.exports = router;

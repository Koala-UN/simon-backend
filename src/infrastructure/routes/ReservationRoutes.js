const express = require('express');
const reservationController = require('../controllers/ReservationController');

const router = express.Router();

// Rutas de reservas
router.get('/', reservationController.getAllReservations);
router.post('/', reservationController.createReservation);
router.post('/:reservationId/table/:tableId', reservationController.assignTable);

router.post('/:reservationId/cancel', reservationController.cancelReservation);
module.exports = router;

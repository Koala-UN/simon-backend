const express = require("express");
const countryRoutes = require("./CountryRoutes");
const helloRoutes = require("./HelloRoutes");
const orderRoutes = require("./OrderRoutes");
const reservationRoutes = require("./ReservationRoutes");
const dishRoutes = require("./DishRoutes");
const router = express.Router();

// Agrupa las rutas
router.use("/countries", countryRoutes);
router.use("/hello", helloRoutes);
router.use("/order", orderRoutes);
router.use("/reserve",reservationRoutes );
router.use("/dish", dishRoutes);
module.exports = router;

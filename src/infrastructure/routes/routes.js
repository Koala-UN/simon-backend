const express = require("express");
const countryRoutes = require("./CountryRoutes");
const helloRoutes = require("./HelloRoutes");
const orderRoutes = require("./OrderRoutes");
const router = express.Router();

// Agrupa las rutas
router.use("/countries", countryRoutes);
router.use("/hello", helloRoutes);
router.use("/order", orderRoutes);
module.exports = router;

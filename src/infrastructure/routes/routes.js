const express = require('express');
const countryRoutes = require('./CountryRoutes');
const helloRoutes = require('./HelloRoutes');

const router = express.Router();

// Agrupa las rutas
router.use('/countries', countryRoutes);
router.use('/hello', helloRoutes);

module.exports = router;

// src/modules/country/routes.js
const express = require('express');
const router = express.Router();
const CountryController = require('../../infrastructure/controllers/CountryController');

// GET /api/countries
router.get('/', CountryController.getAll);

// POST /api/countries
router.post('/', CountryController.create);

module.exports = router;
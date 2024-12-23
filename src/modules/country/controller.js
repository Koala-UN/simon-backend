const CountryService = require('../country/service');

class CountryController {
    async getAll(req, res) {
        try {
            const countries = await CountryService.getAllCountries();
            res.json(countries);
        } catch (error) {
            res.status(500).json({ error: `Failed to retrieve countries: ${error.message}` });
        }
    }

    async create(req, res) {
        try {
            const country = await CountryService.createCountry(req.body);
            res.status(201).json(country);
        } catch (error) {
            res.status(400).json({ error: `Failed to create country: ${error.message}` });
        }
    }
}

module.exports = new CountryController();

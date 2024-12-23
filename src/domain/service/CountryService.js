const Country = require('../models/CountryModel');
const CountryRepository = require('../../infrastructure/repositories/CountryRepository');

class CountryService {
    async getAllCountries() {
        const rows = await CountryRepository.findAll();
        return rows.map(row => Country.fromDB(row));
    }

    async createCountry(countryData) {
        const country = new Country(countryData);
        country.validate();

        const result = await CountryRepository.create(country);

        return Country.fromDB({ id: result.insertId, ...countryData });
    }
}

module.exports = new CountryService();

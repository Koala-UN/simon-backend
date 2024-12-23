const Country = require('../../models/country');
const pool = require('../../database/database');

class CountryService {
    async getAllCountries() {
        const [rows] = await pool.query('SELECT * FROM pais');
        return rows.map(row => Country.fromDB(row));
    }

    async createCountry(countryData) {
        const country = new Country(countryData);
        country.validate();

        const [result] = await pool.query(
            'INSERT INTO pais (nombre) VALUES (?)',
            [country.nombre]
        );

        return Country.fromDB({ id: result.insertId, ...countryData });
    }
}

module.exports = new CountryService();

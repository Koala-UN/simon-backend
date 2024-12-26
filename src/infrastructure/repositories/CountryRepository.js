const pool = require('../../database/connection');
const CountryRepoInterface = require('../../domain/interfaces/country/RepositoryInterface')
class CountryRepository extends CountryRepoInterface{
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM pais');
        return rows;
    }

    async create(country) {
        const [result] = await pool.query(
            'INSERT INTO pais (nombre) VALUES (?)',
            [country.nombre]
        );
        return result;
    }
}

module.exports = new CountryRepository();

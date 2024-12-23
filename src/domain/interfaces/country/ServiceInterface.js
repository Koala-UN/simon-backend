

class CountryServiceInterface {
    getAllCountries() {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }

    createCountry(countryData) {
        throw new Error('ERR_METHOD_NOT_IMPLEMENTED');
    }
}
module.exports = CountryServiceInterface;
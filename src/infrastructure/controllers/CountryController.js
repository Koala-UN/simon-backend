const CountryService = require("../../domain/service/CountryService");
const NotFoundError = require("../../domain/exception/NotFoundError");
const AppError = require("../../domain/exception/AppError");

class CountryController {
  async getAll(req, res, next) {
    try {
      const countries = await CountryService.getAllCountries();
      if (!countries || countries.length === 0) {
        throw new NotFoundError("No countries found");
      }
      res.json(countries);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const country = await CountryService.createCountry(req.body);
      res.status(201).json(country);
    } catch (error) {
      next(new AppError(`Failed to create country: ${error.message}`, 400));
    }
  }
}

module.exports = new CountryController();

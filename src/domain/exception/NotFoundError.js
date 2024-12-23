const AppError = require('./AppError');

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Not Found', 404);
  }
}

module.exports = NotFoundError;

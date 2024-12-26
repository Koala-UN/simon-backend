const AppError = require('./AppError');

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}

module.exports = UnauthorizedError;
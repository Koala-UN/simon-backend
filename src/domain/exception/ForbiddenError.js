const AppError = require('./AppError');

class ForbiddenError extends AppError {
  constructor(message) {
    super(message || 'Forbidden', 403);
  }
}

module.exports = ForbiddenError;
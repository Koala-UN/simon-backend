const AppError = require('./AppError');

/**
 * Clase que representa un error de autorización.
 * 
 * @class UnauthorizedError
 * @extends {AppError}
 * 
 * @param {string} [message] - Mensaje de error opcional. Si no se proporciona, se utilizará 'Unauthorized'.
 */
class UnauthorizedError extends AppError {
  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}

module.exports = UnauthorizedError;
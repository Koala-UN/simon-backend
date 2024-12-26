const AppError = require('./AppError');

/**
 * Clase que representa un error de validación.
 * Extiende de la clase AppError.
 *
 * @class ValidationError
 * @extends {AppError}
 * @param {string} [message] - Mensaje de error opcional. Si no se proporciona, se usará 'Validation Error'.
 */
class ValidationError extends AppError {
  constructor(message) {
    super(message || 'Validation Error', 400);
  }
}

module.exports = ValidationError;
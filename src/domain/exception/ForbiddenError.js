const AppError = require('./AppError');

/**
 * Representa un Error de Prohibición.
 * Este error se lanza cuando un usuario no tiene los permisos necesarios para acceder a un recurso.
 *
 * @class
 * @extends {AppError}
 * @param {string} [message='Forbidden'] - El mensaje de error.
 */
class ForbiddenError extends AppError {
  constructor(message) {
    super(message || 'Forbidden', 403);
  }
}

module.exports = ForbiddenError;
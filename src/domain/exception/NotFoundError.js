const AppError = require('./AppError');

/**
 * Clase que representa un error de tipo "No Encontrado".
 * Extiende de la clase AppError.
 * 
 * @class NotFoundError
 * @extends {AppError}
 * 
 * @param {string} [message] - Mensaje de error opcional. Si no se proporciona, se usará 'Not Found'.
 * 
 * @example
 * throw new NotFoundError('El recurso solicitado no fue encontrado');
 */
class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Not Found', 404);
  }
}

module.exports = NotFoundError;

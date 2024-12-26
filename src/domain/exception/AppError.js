/**
 * Clase que representa un error de aplicación.
 * Extiende de la clase Error de JavaScript.
 * 
 * @class
 * @extends {Error}
 * 
 * @param {string} message - El mensaje de error.
 * @param {number} statusCode - El código de estado HTTP asociado con el error.
 * 
 * @property {number} statusCode - El código de estado HTTP asociado con el error.
 * @property {boolean} isOperational - Indica si el error es operacional (true) o no (false).
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;

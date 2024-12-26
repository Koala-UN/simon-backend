/**
 * Middleware para manejar errores asíncronos.
 * @param {Function} fn - Función asíncrona a envolver.
 * @returns {Function} - Función que maneja errores asíncronos.
 */
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = asyncHandler;
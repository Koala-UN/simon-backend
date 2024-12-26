/**
 * Middleware para manejar errores asíncronos.
 * @param {Function} fn - Función asíncrona a envolver.
 * @returns {Function} - Función que maneja errores asíncronos.
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    // Asegurarse de que la función devuelva una promesa
    Promise.resolve(fn(req, res, next)).catch(next); 
    // Capturar cualquier error y pasarlo al siguiente middleware
  };
}

module.exports = asyncHandler;

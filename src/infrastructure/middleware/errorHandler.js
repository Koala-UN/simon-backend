const AppError = require('../../domain/exception/AppError');

const errorHandler = (err, req, res, next) => {
  // Si el error no es operativo, se considera un error desconocido
  if (!err.isOperational) {
    console.error('ERROR 💥:', err);
    err = new AppError('An unexpected error occurred', 500);
  }

  // Enviar la respuesta con el mensaje de error y el código de estado
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
  });
};

module.exports = errorHandler;

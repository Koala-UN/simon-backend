const ValidationError = require("../../domain/exception/ValidationError");

const validationMiddleware = (validateFn) => {
  return (req, res, next) => {
    const { error } = validateFn(req.body);
    if (error) {
      return next(new ValidationError(error.details[0].message));
    }
    next();
  };
};

module.exports = validationMiddleware;

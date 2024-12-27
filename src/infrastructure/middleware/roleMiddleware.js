const ForbiddenError = require("../../domain/exception/ForbiddenError");

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return next(new ForbiddenError("User does not have the required role"));
    }
    next();
  };
};

module.exports = roleMiddleware;

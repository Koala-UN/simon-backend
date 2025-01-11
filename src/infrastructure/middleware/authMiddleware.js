const UnauthorizedError = require("../../domain/exception/UnauthorizedError");

const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return next(new UnauthorizedError("User is not authenticated"));
  }
  next();
};

module.exports = authMiddleware;

const express = require("express");
const routes = require("./infrastructure/routes/routes");
const errorHandler = require("./infrastructure/middleware/errorHandler");
const notFoundHandler = require("./infrastructure/middleware/notFounHandler");
const authMiddleware = require("./infrastructure/middleware/authMiddleware");

const app = express();
const cors = require("cors");
// Habilitar CORS
app.use(cors());
app.use(express.json()); // Agregar este middleware para parsear JSON
// Usar las rutas centralizadas
app.use("/api", routes);

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);
// Middleware de manejo de errores
app.use(errorHandler);
// Middleware de autenticación
app.use(authMiddleware);

module.exports = app;

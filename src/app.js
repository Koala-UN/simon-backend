const express = require("express");
const routes = require("./infrastructure/routes/routes");
const errorHandler = require("./infrastructure/middleware/errorHandler");
const notFoundHandler = require("./infrastructure/middleware/notFounHandler");

// const authMiddleware = require("./infrastructure/middleware/authMiddleware");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Importar cookie-parser

const { passport } = require('./config/authConfig');

// Configuración de CORS
const corsOptions = {
  origin: true, // Permitir peticiones de cualquier lado
  credentials: true, // Permite el envío de cookies
};

app.use(cors(corsOptions));
app.use(cookieParser()); // Usar cookie-parser antes de cualquier middleware que necesite acceder a las cookies
app.use(express.json()); // Agregar este middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); // Agregar este middleware para parsear datos de formularios
app.use(passport.initialize());

// Usar las rutas centralizadas
app.use("/api", routes);

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
const express = require("express");
const routes = require("./infrastructure/routes/routes");
const errorHandler = require("./infrastructure/middleware/errorHandler");
const notFoundHandler = require("./infrastructure/middleware/notFounHandler");
const authMiddleware = require("./infrastructure/middleware/authMiddleware");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Importar cookie-parser

const {passport} = require('./config/authConfig');

const corsOptions = {
    origin: 'http://localhost:5173', // Reemplaza con el origen de tu frontend
    credentials: true, // Permite el envío de cookies
  };
  
app.use(cors(corsOptions));
// Habilitar CORS
//app.use(cors());

app.use(cookieParser()); // Usar cookie-parser antes de cualquier middleware que necesite acceder a las cookies

app.use(express.json()); // Agregar este middleware para parsear JSON
app.use(passport.initialize());

// Usar las rutas centralizadas
app.use("/api", routes);

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);
// Middleware de manejo de errores
app.use(errorHandler);
// Middleware de autenticación, se debe usar en las rutas que se quieran proteger
//app.use(authMiddleware);

module.exports = app;

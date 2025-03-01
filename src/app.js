const express = require("express");
const routes = require("./infrastructure/routes/routes");
const errorHandler = require("./infrastructure/middleware/errorHandler");
const notFoundHandler = require("./infrastructure/middleware/notFounHandler");

// const authMiddleware = require("./infrastructure/middleware/authMiddleware");

const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Importar cookie-parser

const { passport } = require('./config/authConfig');

const allowedOrigins = [
  'https://simon-frontend-xi.vercel.app',
  'http://localhost:5173', // Añade tu origen local aquí
  'http://localhost:3000'
];

const corsOptions = {
  origin: true, // Permitir todos los orígenes
  credentials: true, // Permite el envío de cookies
};


app.use(cors(corsOptions));
app.use(cookieParser()); // Usar cookie-parser antes de cualquier middleware que necesite acceder a las cookies
app.use(express.json()); // Agregar este middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); // Agregar este middleware para parsear datos de formularios
app.use(passport.initialize());

// Usar las rutas centralizadas
app.use("/api", routes);

app.get('/api/proxy/github-image', async (req, res) => {
  const imageUrl = req.query.url;
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.log("este es el eerrrroooor:::: --->"+error);
    res.status(error.response).json(error.response);
  }
});

// Middleware para manejar rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
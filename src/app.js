const express = require('express');
const countryRoutes = require('./modules/country/routes');
const hello = require('./modules/hello/routes');
const app = express();
const cors = require('cors');
// Habilitar CORS
app.use(cors());
app.use(express.json()); // Agregar este middleware para parsear JSON
app.use('/api/countries', countryRoutes);
app.use('/api/hello', hello);


// Error handling
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

module.exports = app;
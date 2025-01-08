const app = require('./app');
const config = require('./config/config');
const cloudinary = require('cloudinary').v2;

app.listen(config.app.port, () => {
    console.log(`Server running at http://localhost:${config.app.port}`);
});

// Configura Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});
const app = require('./app');
const config = require('./config/config');
const cloudinary = require('cloudinary').v2;

const port = process.env.PORT || 5000;
app.listen(8080, () => {
    console.log(`Server running at http://localhost:${8080}`);
});

// Configura Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});
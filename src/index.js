const app = require('./app');
const config = require('./config/config');
// const cloudinary = require('cloudinary').v2;

app.listen(config.app.port, () => {
    console.log(`Server running at http://localhost:${config.app.port}`);
});


// test
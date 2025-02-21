const app = require('./app');
// const config = require('./config/config');
// const cloudinary = require('cloudinary').v2;

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
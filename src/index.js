const app = require('./app');
const config = require('./config/config');

app.listen(config.app.port, () => {
    console.log(`Server running at http://localhost:${config.app.port}`);
});
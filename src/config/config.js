require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 4000,
    },
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'mydb',
        port: process.env.DB_PORT || 3306,
    },
    mercadopago: {
        accessToken: process.env.ACCESS_TOKEN_2||'undefined',
        publicKey: process.env.PUBLIC_KEY_PAGO_2||'undefined',
    },

};
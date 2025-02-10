require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 4000,
        frontendURL: process.env.FRONTEND_URL || 'http://localhost:5173',
        backendURL: process.env.BACKEND_URL || 'http://localhost:5000',
    },
    db: {
        host: process.env.MYSQL_ADDON_HOST || 'localhost',
        user: process.env.MYSQL_ADDON_USER || 'root',
        password: process.env.MYSQL_ADDON_PASSWORD || 'Simon#123',
        database: process.env.MYSQL_ADDON_DB || 'mydb',
        port: process.env.MYSQL_ADDON_PORT || 3306,
    },
    mercadopago: {
        accessToken: process.env.ACCESS_TOKEN_MERCADO_PAGO||'undefined',
        publicKey: process.env.PUBLIC_KEY_PAGO_2||'undefined',
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'undefined',
        api_key: process.env.CLOUDINARY_API_KEY || 'undefined',
        api_secret: process.env.CLOUDINARY_API_SECRET || 'undefined',
    },    
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtExpiration: parseInt(process.env.JWT_EXPIRATION),
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
        googleClientID: process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
        googleCallbackURL: process.env.GOOGLE_CALLBACK_URL
    }

};
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const restaurantRepository = require('../infrastructure/repositories/RestaurantRepository');
const restaurantService = require('../domain/service/RestaurantService');
const jwt = require('jsonwebtoken');
const config = require('./config');
const {sendVerificationEmail} = require('../utils/email');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Buscar usuario por Google ID
    let user = await restaurantRepository.findByGoogleId(profile.id);
    if (!user) {
      // Buscar usuario por correo electrónico
      user = await restaurantRepository.findByEmail(profile.emails[0].value);
      
      if (user) {
        // Vincular Google ID con la cuenta existente
        await restaurantRepository.updateRestaurant(user.id, { idAutenticacion: profile.id });
      } else {
        // Crear un nuevo usuario con el perfil de Google
        const restaurantData = {
          nombre: profile.displayName,
          correo: profile.emails[0].value,
          idAutenticacion: profile.id,
          estado: "NO_VERIFICADO",
          telefono: null,
          idTransaccional: null,
          capacidadReservas: null,
          categoria: null,
          descripcion: null,
          contrasena: null,
        };
        
        const addressData = {
          direccion: "Establecer dirección de " + profile.displayName,
        };
        
        const cityId = 1; // ID de la ciudad por defecto
        
        // Crear el nuevo restaurante y enviar correo de verificación
        user = await restaurantRepository._create(restaurantData, addressData, cityId);
        const verificationToken = jwt.sign({ id: user.id, correo: user.correo }, config.auth.jwtSecret, { expiresIn: config.auth.jwtExpiration });
        await sendVerificationEmail(user.correo, verificationToken);
      }
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await restaurantRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});



module.exports = {
  passport,
};
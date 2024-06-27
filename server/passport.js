const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Assurez-vous de créer ce modèle
const { generateRandomPassword } = require('./utils'); // Importez votre fonction pour générer un mot de passe aléatoire
require('dotenv').config();

// Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      scope: ['profile', 'email'],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await User.findOne({ google_id: profile.id });

        if (user) {
          return done(null, user);
        } else {
          const randomPassword = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(randomPassword, 10);

          user = new User({
            email: profile.emails[0].value,
            google_id: profile.id,
            password: hashedPassword,
          });

          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;

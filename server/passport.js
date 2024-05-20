const bcrypt = require('bcrypt');
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const passport = require("passport");
const db = require("./db"); // Importer la connexion à la base de données
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Fonction pour générer un mot de passe aléatoire
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8);
};

// Fonction pour nettoyer les données utilisateur
const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const query = "SELECT * FROM users WHERE google_id = ?";
        const [existingUsers] = await db.query(query, [profile.id]);

        if (existingUsers.length > 0) {
          return done(null, sanitizeUser(existingUsers[0]));
        } else {
          // Génère un mot de passe aléatoire
          const randomPassword = generateRandomPassword();
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          
          // Insère un nouvel utilisateur avec un mot de passe aléatoire dans la base de données
          const insertQuery = "INSERT INTO users (email, google_id, password) VALUES (?, ?, ?)";
          await db.execute(insertQuery, [profile.emails[0].value, profile.id, hashedPassword]);

          // Récupère le nouvel utilisateur de la base de données
          const newUserQuery = "SELECT * FROM users WHERE google_id = ?";
          const [newUsers] = await db.query(newUserQuery, [profile.id]);
          
          return done(null, sanitizeUser(newUsers[0]));
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
    const query = "SELECT * FROM users WHERE id = ?";
    const [results] = await db.query(query, [id]);
    done(null, sanitizeUser(results[0]));
  } catch (err) {
    done(err);
  }
});

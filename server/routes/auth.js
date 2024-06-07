const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../db"); // Importer la connexion à la base de données
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};


// Configurer le transporteur d'e-mails
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction pour nettoyer les données utilisateur
const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Middleware de validation
const validateSignup = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').not().isEmpty().withMessage('Password cannot be empty'),
];


// Route pour demander la réinitialisation de mot de passe
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const [results] = await db.query(query, [email]);
    if (results.length === 0) return res.status(404).json({ error: "User not found" });

    const user = results[0];
    const token = crypto.randomBytes(20).toString('hex');
    const expireDate =new Date(Date.now() + 3600000); // 1 hour

    await db.execute("UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?", [token, expireDate, email]);

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetURL}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Error sending email' });
      }
      console.log('Email sent:', response);
      res.status(200).json({ message: 'Password reset email sent' });
  });
} catch (err) {
  console.error('Database error:', err);
  res.status(500).json({ error: "Database error" });
}
});

// Route pour réinitialiser le mot de passe
router.post("/reset-password/:token", async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const query = "SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > ?";
    const [results] = await db.query(query, [token, Date.now()]);
    if (results.length === 0) return res.status(400).json({ error: "Password reset token is invalid or has expired" });

    const user = results[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute("UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?", [hashedPassword, user.id]);

    res.status(200).json({ message: "Password has been reset" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

// Route d'inscription
router.post("/signup", validateSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password , 10);
    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    await db.execute(query, [email, hashedPassword]);
    const [result] = await db.query("SELECT LAST_INSERT_ID() as id");
    const user = { id: result[0].id, email };
    const token = generateToken(user);
    res.status(201).json({ message: "User created", token, user: sanitizeUser(user) });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Route de connexion
router.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
      const query = "SELECT * FROM users WHERE email = ?";
      const [results] = await db.query(query, [email]);
      if (results.length === 0) return res.status(404).json({ error: "User not found" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      const token = generateToken(user);
      
      // Retourner les informations de l'utilisateur (avec nettoyage des données sensibles)
      res.status(200).json({ message: "Logged in", token, user: sanitizeUser(user) });
  } catch (err) {
      res.status(500).json({ error: "Database error" });
  }
});

router.get("/auth/me", authenticateToken, (req, res) => {
  const user = sanitizeUser(req.user); // Assurez-vous que cette fonction est adaptée à votre contexte
  res.json({ user });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}


router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: sanitizeUser(req.user),
   
      
    });
  

    
  } else {
    
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = {
  router,
  authenticateToken,
  generateToken,
};

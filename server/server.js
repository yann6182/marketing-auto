require('dotenv').config();
require('./cronJobs');

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');

const authRoute = require('./routes/auth');
const clientsRoute = require('./routes/clients');
const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Middleware pour les sessions de cookie
app.use(
  cookieSession({
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// Initialisation de passport et utilisation des sessions
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000', 
      'https://marketing-auto.vercel.app',
      'https://marketing-auto-7id1eevst-yannicks-projects-d5baabca.vercel.app',
      'https://www.marketing-auto.me',
     
    ],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);



// Routes
app.use("/auth", authRoute.router); 
app.use("/clients", clientsRoute); 



const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

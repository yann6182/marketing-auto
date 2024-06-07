require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const db = require("./db"); // Importer la connexion à la base de données
const authRoute = require("./routes/auth");
const clientsRoute = require('./routes/clients'); // Assurez-vous que le chemin est correct

const passportStrategy = require("./passport");
const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 1000, // Correction de l'unité de temps à millisecondes
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use(express.json()); // Pour parser les requêtes JSON

app.use("/auth", authRoute.router); // Utilisez authRoute.router
app.use("/clients", clientsRoute); // clientsRoute doit être un routeur

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));

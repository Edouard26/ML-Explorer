// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const app = express();
const jwt = require('jsonwebtoken');

// Connection à MongoDB
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
     console.log("Nous sommes connectés à la base de données!");
});

// Modèle d'utilisateur pour Mongoose
const UserSchema = new mongoose.Schema({
     username: String,
     password: String,
});
const UserModel = mongoose.model('User', UserSchema);

// Utilisation de la session pour le suivi de l'utilisateur
app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
}));


app.use(flash());


passport.use(new LocalStrategy((username, password, done) => {
     UserModel.findOne({ username: username }, (err, user) => {
          if (err) { return done(err); }
          if (!user) {
               return done(null, false, { message: 'Incorrect username.'});
          }
          if (!bcrypt.compareSync(password, user.password)) {
               return done(null, false, { message: 'Incorrect password.'});
          }
          return done(null, user);
     });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
     UserModel.findById(id, (err, user) => done(err, user));
});
app.use(passport.initialize());
app.use(passport.session());


// Importez le module authRoutes
const authRouter = require('./authRoutes')(passport);

// Créer un utilisateur (enregistrement)
app.post('/auth/register', (req, res) => {
     // Logic for registration
});

// Connecter l'utilisateur (connexion)
app.post('/auth/login', (req, res) => {
     // Logic for login
});

// Utilisez le routeur
app.use('/auth', authRouter);

// Servir les fichiers statiques de l'application React
app.use(express.static(path.join(__dirname, 'dist')));

// Pour toute demande, servir l'index.html
app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
});

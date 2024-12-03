const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
module.exports = function(passport) {
const router = express.Router();

// Route d'inscription
router.post('/register', (req, res) => {
  res.send('Inscription non encore mise en place');
});

// Route de connexion
router.post('/login', function(req, res, next) {
  res.send('Connexion non encore mise en place');
});

return router;
};

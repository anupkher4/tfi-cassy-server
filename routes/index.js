var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');
var passport = require('../services/passport-config');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Cassy-server', description: 'Welcome to Cassy.' });
});

// Login
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    res.status(200).send(req.user);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;

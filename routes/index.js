var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');
var passport = require('../services/passport-config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cassy-server', description: 'This site is under construction' });
});

// Login
router.post('/login', 
  passport.authenticate('local', { session: false }), 
  (req, res) => {
    res.status(200).send(req.user);
});

module.exports = router;

var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');
var passport = require('../services/passport-config');

// Login
router.post('/login', passport.authenticate('local', { failureFlash: true }));

module.exports = router;
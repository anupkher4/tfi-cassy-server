var connection = require('../database/connection');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Configure Passport strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Find user by username
    connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], (err, user) => {
      if (err) {
        return done(err);
      }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      
      return done(null, user);
    });
  }
));

module.exports = passport;

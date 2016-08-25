var connection = require('../database/connection');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Configure Passport strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Check password hash
    connection.query('SELECT * FROM user WHERE active = ? AND username = ? AND password = ?', [true, username, password], (err, user) => {
      if (err) {
        return done(err);
      }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.'});
      }
      
      return done(null, user);
    });
  }
));

// Serialize and De-serialize users for sessions
passport.serializeUser((user, done) => {
  done(null, user[0].user_id);
});

passport.deserializeUser((id, done) => {
  connection.query('SELECT * FROM user WHERE active = ? AND user_id = ?', [true, id], (err, user) => {
    if (err) {
      done(err);
    }
    
    done(null, user);
  });
});

module.exports = passport;

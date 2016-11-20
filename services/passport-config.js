var connection = require('../database/connection');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Configure Passport strategy
passport.use(new LocalStrategy(
  (username, password, done) => {
    
    connection.query('SELECT * FROM user WHERE active = ? AND username = ?', [true, username], (err, user) => {
      if (err) {
        return done(err);
      }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.'});
      }
      
      
      //console.log(`From db->${user[0].password}`);
      
      // Check password hash
      bcrypt.compare(password, user[0].password, (err, res) => {
        if (res) {
          return done(null, user);
        }
        return done(null, false, { message: 'Incorrect password.'});
      });
      
      
      //return done(null, user);
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

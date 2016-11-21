var express = require('express'), cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('./services/passport-config');

// routes files
var routes = require('./routes/index');
var users = require('./routes/users');
var students = require('./routes/students');
var schools = require('./routes/schools');
var formFields = require('./routes/form-fields');
var formFieldNames = require('./routes/form-field-names');
var schoolUsers = require('./routes/school-users');
var eventAttendances = require('./routes/event-attendances');
var forgotPassword = require('./routes/forgot-password');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ 
  secret: 'banana',
  resave: false,
  saveUninitialized: false
 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use('/', routes);
app.use('/users', users);
app.use('/students', students);
app.use('/schools', schools);
app.use('/form-fields', formFields);
app.use('/form-field-names', formFieldNames);
app.use('/school-users', schoolUsers);
app.use('/event-attendances', eventAttendances);
app.use('/forgot-password', forgotPassword);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

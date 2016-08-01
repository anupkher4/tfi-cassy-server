var connection = require('../database/connection');

var moment = require('moment');
var chance = require('chance').Chance();

var apiManager = {};

// Build user object details
var rightNow = moment().format('YYYY-MM-DD HH:mm:ss');
var managerId = () => {
  var id = chance.integer();
  if (id < 0) {
    return -(id);
  }
  return id;
};
var initialPassword = chance.string({length: 8});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('error establishing connection' + err.stack);
    return
  }
  
  console.log('connected as id' + connection.threadId);
});

// Change password
apiManager.changePassword = (id, params, callback) => {
  var username = params.user.username;
  var password = params.user.password;
  connection.query('UPDATE user SET password = ? WHERE user_id = ? AND username = ?', [password, id, username], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Create a new user
apiManager.createUser = (params, callback) => {
  var user = {
    first_name: params.user.firstname,
    last_name: params.user.lastname,
    username: params.user.username,
    password: initialPassword,
    role: params.user.role,
    manager_user_id: params.user.managerid,
    created_at: rightNow,
    created_by: 'anup',
    last_modified_at: rightNow,
    last_modified_by: 'anup',
    active: chance.bool()
  };
  connection.query('INSERT INTO user SET ?', user, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a user
apiManager.getUser = (id, callback) => {
  connection.query('SELECT * FROM user WHERE user_id = ?', id, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a user
apiManager.updateUser = (id, params, callback) => {
  var user = {
    first_name: params.user.firstname,
    last_name: params.user.lastname,
    username: params.user.username,
    password: params.user.password,
    role: params.user.role,
    manager_user_id: params.user.managerid,
    created_at: rightNow,
    created_by: 'anup',
    last_modified_at: rightNow,
    last_modified_by: 'anup',
    active: chance.bool()
  };
  connection.query('UPDATE user SET ? WHERE user_id = ?', [user, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a user
apiManager.deleteUser = (id, callback) => {
  connection.query('DELETE FROM user WHERE user_id = ?', id, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Close database connection
var closeDatabaseConnection = () => {
  connection.end((err) => {
    if (err) {
      console.error('error terminating connection' + err.stack);
    }

    console.log('connection is terminated now');
  });
};


module.exports = apiManager;
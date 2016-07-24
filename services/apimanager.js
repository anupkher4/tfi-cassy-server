var connection = require('../database/connection');

var moment = require('moment');
var Chance = require('chance');
var chance = new Chance();

var apimanager = {};

// Build user object details
var rightNow = moment().format('YYYY-MM-DD HH:mm:ss');
var managerId = () => {
  var id = chance.integer();
  if (id < 0) {
    return -(id);
  }
  return id;
};

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error('error establishing connection' + err.stack);
    return
  }
  
  console.log('connected as id' + connection.threadId);
});

// Create a new user
apimanager.createUser = (params, callback) => {
  var user = {
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
  connection.query('INSERT INTO user SET ?', user, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a user
apimanager.getUser = (id, callback) => {
  connection.query('SELECT * FROM user WHERE user_id = ?', id, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a user
apimanager.updateUser = (id, params, callback) => {
  var user = {
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
apimanager.deleteUser = (id, callback) => {
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


module.exports = apimanager;

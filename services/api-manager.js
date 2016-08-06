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

// USERS
var createUserWithData = (fname, lname, uname, pass, role, manId, cAt, cBy, mAt, mBy, active) => {
  var user = {
    first_name: fname,
    last_name: lname,
    username: uname,
    password: pass,
    role: role,
    manager_user_id: manId,
    created_at: cAt,
    created_by: cBy,
    last_modified_at: mAt,
    last_modified_by: mBy,
    active: active
  };
  
  return user;
};

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
  var user = createUserWithData(
    params.user.firstname, 
    params.user.lastname, 
    params.user.username, 
    initialPassword, 
    params.user.role,
    params.user.managerid,
    rightNow,
    'anup',
    rightNow,
    'anup',
    chance.bool()
  );
  connection.query('INSERT INTO user SET ?', user, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all users
apiManager.allUsers = (callback) => {
  connection.query('SELECT * FROM user', (err, result) => {
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
  var user = createUserWithData(
    params.user.firstname, 
    params.user.lastname, 
    params.user.username, 
    params.user.password, 
    params.user.role,
    params.user.managerid,
    rightNow,
    'anup',
    rightNow,
    'anup',
    chance.bool()
  );
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

// STUDENTS
var createStudentWithData = (fname, lname, gender, ethn, cAt, cBy, mAt, mBy, active) => {
  var student = {
    first_name: fname,
    last_name: lname,
    gender: gender,
    ethnicity: ethn,
    created_at: cAt,
    created_by: cBy,
    last_modified_at: mAt,
    last_modified_by: mBy,
    active: active
  };
  
  return student;
};

// Create a student
apiManager.createStudent = (params, callback) => {
  var student = createStudentWithData (
    params.student.firstname,
    params.student.lastname,
    params.student.gender,
    params.student.ethnicity,
    rightNow,
    'admin',
    rightNow,
    'admin',
    chance.bool()
  );
  connection.query('INSERT INTO student SET ?', student, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all students
apiManager.allStudents = (callback) => {
  connection.query('SELECT * FROM student', (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a student
apiManager.getStudent = (id, callback) => {
  connection.query('SELECT * FROM student WHERE student_id = ?', id, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a student
apiManager.updateStudent = (id, params, callback) => {
  var student = createStudentWithData (
    params.student.firstname,
    params.student.lastname,
    params.student.gender,
    params.student.ethnicity,
    rightNow,
    'admin',
    rightNow,
    'admin',
    chance.bool()
  );
  connection.query('UPDATE student SET ? WHERE student_id = ?', [student, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a user
apiManager.deleteStudent = (id, callback) => {
  connection.query('DELETE FROM student WHERE student_id = ?', id, (err, result) => {
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
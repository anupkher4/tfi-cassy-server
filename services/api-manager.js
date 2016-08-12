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
    first_name: params.firstname,
    last_name: params.lastname,
    username: params.username,
    password: initialPassword,
    role: params.role,
    manager_user_id: params.managerid,
    first_login: true,
    created_at: rightNow,
    created_by: 'anup',
    last_modified_at: rightNow,
    last_modified_by: 'anup',
    active: true
  };
  connection.query('INSERT INTO user SET ?', user, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all users
apiManager.allUsers = (callback) => {
  connection.query('SELECT * FROM user WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a user
apiManager.getUser = (id, callback) => {
  connection.query('SELECT * FROM user WHERE active = ? AND user_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a user
apiManager.updateUser = (id, params, callback) => {
  var user = {
    first_name: params.firstname,
    last_name: params.lastname,
    username: params.username,
    role: params.role,
    manager_user_id: params.managerid,
    first_login: false,
    last_modified_at: rightNow,
    last_modified_by: 'anup',
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
  connection.query('UPDATE user SET active = ? WHERE user_id = ?', [false, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// STUDENTS
// Create a student
apiManager.createStudent = (params, callback) => {
  var student = {
    first_name: params.firstname,
    last_name: params.lastname,
    gender: params.gender,
    ethnicity: params.ethnicity,
    created_at: rightNow,
    created_by: 'admin',
    last_modified_at: rightNow,
    last_modified_by: 'admin',
    active: true
  };
  connection.query('INSERT INTO student SET ?', student, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all students
apiManager.allStudents = (callback) => {
  connection.query('SELECT * FROM student WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a student
apiManager.getStudent = (id, callback) => {
  connection.query('SELECT * FROM student WHERE active = ? AND student_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a student
apiManager.updateStudent = (id, params, callback) => {
  var student = {
    first_name: params.firstname,
    last_name: params.lastname,
    gender: params.gender,
    ethnicity: params.ethnicity,
    last_modified_at: rightNow,
    last_modified_by: 'admin'
  };
  connection.query('UPDATE student SET ? WHERE student_id = ?', [student, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a user
apiManager.deleteStudent = (id, callback) => {
  connection.query('UPDATE student SET active = ?', false, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// SCHOOL
// Create a school
apiManager.createSchool = (params, callback) => {
  var school = {
    school_name: params.name,
    address: params.address,
    principal: params.principal,
    primary_contact: params.primaryContact,
    primary_contact_email: params.contactEmail,
    school_district: params.district,
    created_at: rightNow,
    created_by: 'admin',
    last_modified_at: rightNow,
    last_modified_by: 'admin',
    active: true 
  };
  
  connection.query('INSERT INTO school VALUES ?', school, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all schools
apiManager.getAllSchools = (callback) => {
  connection.query('SELECT * FROM school WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a specific school
apiManager.getSchool = (id, callback) => {
  connection.query('SELECT * FROM school WHERE school_id = ?', id, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a school
apiManager.updateSchool = (id, params, callback) => {
  var school = {
    school_name: params.name,
    address: params.address,
    principal: params.principal,
    primary_contact: params.primaryContact,
    primary_contact_email: params.contactEmail,
    school_district: params.district,
    last_modified_at: rightNow,
    last_modified_by: 'admin' 
  };
  connection.query('UPDATE school SET ? WHERE school_id = ?', [school, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a school
apiManager.deleteSchool = (id, callback) => {
  connection.query('UPDATE school SET active = ? WHERE school_id = ?', [false, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// EVENTS
// Create an event
apiManager.createEvent = (id, params, callback) => {
  var event = {
    school_id: id,
    event_name: params.name,
    event_type: params.type,
    event_other: params.other,
    event_description: params.description,
    iep_minutes: params.iepMinutes,
    number_of_attendees: params.attendees,
    event_date: params.date,
    created_at: rightNow,
    created_by: 'anup',
    last_modified_at: rightNow,
    last_modified_by: 'anup',
    active: true
  };
  connection.query('INSERT INTO event SET', event, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all events
apiManager.getAllEvents = (callback) => {
  connection.query('SELECT * FROM event', (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all events for a school
apiManager.getSchoolEvents = (id, callback) => {
  connection.query('SELECT * FROM event WHERE school_id = ?', id, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a specific event
apiManager.getEvent = (id, callback) => {
  connection.query('SELECT * FROM event WHERE event_id = ?', id, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update an event
apiManager.updateEvent = (id, params, callback) => {
  var event = {
    school_id: params.schoolId,
    event_name: params.name,
    event_type: params.type,
    event_other: params.other,
    event_description: params.description,
    iep_minutes: params.iepMinutes,
    number_of_attendees: params.attendees,
    event_date: params.date,
    last_modified_at: rightNow,
    last_modified_by: 'anup'
  };
  connection.query('UPDATE event SET ? WHERE event_id = ?', [event, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete an event
apiManager.deleteEvent = (id, callback) => {
  connection.query('UPDATE event SET active = ? WHERE event_id = ?', [false, id], (err, result) => {
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
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

// Delete a student
apiManager.deleteStudent = (id, callback) => {
  connection.query('UPDATE student SET active = ?', false, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// STUDENT GRADE
// Get all student grades
apiManager.getAllStudentGrades = (callback) => {
  connection.query('SELECT * FROM student_grade WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get student grade by id
apiManager.getStudentGrade = (id, callback) => {
  connection.query('SELECT * FROM student_grade WHERE active = ? AND student_grade_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get student grade by student id
apiManager.getStudentGradeByStudent = (id, callback) => {
  connection.query('SELECT * FROM student_grade WHERE active = ? AND student_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Create student grade
apiManager.createStudentGrade = (id, params, callback) => {
  var grade = {
    student_id: id,
    grade: params.grade,
    school: params.school,
    therapist: params.therapist,
    started_at: rightNow,
    referral_source: params.source,
    free_reduced_lunch: params.lunch,
    school_year: params.year,
    created_at: rightNow,
    created_by: 'admin',
    last_modified_at: rightNow,
    last_modified_by: 'admin',
    active: true
  };
  connection.query('INSERT INTO student_grade VALUES ?', grade, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update student grade
apiManager.updateStudentGrade = (id, params, callback) => {
  var grade = {
    student_id: id,
    grade: params.grade,
    school: params.school,
    therapist: params.therapist,
    referral_source: params.source,
    free_reduced_lunch: params.lunch,
    school_year: params.year,
    last_modified_at: rightNow,
    last_modified_by: 'admin'
  };
  connection.query('UPDATE student_grade SET ? WHERE student_id = ?', [grade, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete student grade
apiManager.deleteStudentGrade = (id, callback) => {
  connection.query('UPDATE student_grade SET active = ? WHERE student_grade_id = ?', [false, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// STUDENT NOTES
// Get all student notes
apiManager.getAllStudentNotes = (callback) => {
  connection.query('SELECT * FROM student_note WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get student note by id
apiManager.getStudentNote = (id, callback) => {
  connection.query('SELECT * FROM student_note WHERE active = ? AND student_note_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get student note by student
apiManager.getStudentNoteByStudent = (id, callback) => {
  connection.query('SELECT * FROM student_note WHERE active = ? AND student_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Create a student note
apiManager.createStudentNote = (id, params, callback) => {
  var note = {
    student_id: id,
    note: params.note,
    posted_at: rightNow,
    created_at: rightNow,
    created_by: 'admin',
    last_modified_at: rightNow,
    last_modified_by: 'admin',
    active: true
  };
  connection.query('INSERT INTO student_note VALUES ?', note, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a student note
apiManager.updateStudentNote = (id, params, callback) => {
  var note = {
    student_id: id,
    note: params.note,
    posted_at: params.posted,
    last_modified_at: rightNow,
    last_modified_by: 'admin'
  };
  connection.query('UPDATE student_note SET ? WHERE student_id = ?', [note, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a student note
apiManager.deleteStudentNote = (id, callback) => {
  connection.query('UPDATE student_note SET active = ? WHERE student_id = ?', [false, id], (err, result) => {
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
  connection.query('SELECT * FROM school WHERE active = ? AND school_id = ?', [true, id], (err, result) => {
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
  connection.query('SELECT * FROM event WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all events for a school
apiManager.getSchoolEvents = (id, callback) => {
  connection.query('SELECT * FROM event WHERE active = ? AND school_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a specific event
apiManager.getEvent = (id, callback) => {
  connection.query('SELECT * FROM event WHERE active = ? AND event_id = ?', [true, id], (err, result) => {
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

// FORM FIELDS
// Get all form fields
apiManager.getAllFormFields = (callback) => {
  connection.query('SELECT * FROM form_field WHERE active = ?', false, (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};

// Get a form field by id
apiManager.getFormField = (id, callback) => {
  connection.query('SELECT * FROM form_field WHERE active = ? AND field_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a form field by name
apiManager.getFormFieldByName = (name, callback) => {
  connection.query('SELECT * FROM form_field WHERE active = ? AND field_name = ?', [true, name], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Add a form field
apiManager.createFormField = (params, callback) => {
  var field = {
    field_name: params.name,
    field_value: params.value,
    created_at: rightNow,
    created_by: 'admin',
    last_modified_at: rightNow,
    last_modified_by: 'admin',
    active: true
  };
  connection.query('INSERT INTO from_field VALUES ?', field, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a form field
apiManager.updateFormField = (id, params, callback) => {
  var field = {
    field_name: params.name,
    field_value: params.value,
    last_modified_at: rightNow,
    last_modified_by: 'admin'
  };
  connection.query('UPDATE form_field SET ? WHERE field_id = ?', [field, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a form field
apiManager.deleteFormField = (id, callback) => {
  connection.query('UPDATE form_field SET active = ?', false, (err, resulr) => {
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
var connection = require('../database/connection');

var moment = require('moment');
var chance = require('chance').Chance();
var bcrypt = require('bcrypt');
var apiMailgun = require('../services/mailgun');

const saltRounds = 10;
var apiManager = {};

// Initial user details
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



// SENDING EMAILS
apiManager.sendEmailWithPassword = (password, callback) => {
  // Construct email data object
  var data = {
    from: 'Admin <admin@cassyapp.com>',
    to: 'anup.kher.1990@gmail.com',
    subject: 'Hello from Cassy',
    text: `You have been entered into the system. Your default password is ${password}. Please change your password after logging-in.`
  };

  // Send email with default password
  apiMailgun.sendMail(data, (err, body) => {
    if (err) {
      callback(err);
    }
    
    callback(null, body);
  });
};



// USERS
// Get user role
apiManager.getUserRole = (id, callback) => {
  connection.query('SELECT role FROM user WHERE active = ? AND user_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result[0].role);
  });
};

// Check for administrator access
apiManager.hasAdministratorAccess = (id, callback) => {
  apiManager.getUserRole(id, (err, result) => {
    if (err) {
      callback(err);
    }
    if (result !== 'administrator') {
      callback(null, false);
    }
    callback(null, true);
  });
};

// First login
apiManager.firstLogin = (loggedInId, callback) => {
  connection.query('UPDATE user SET first_login = ? WHERE user_id = ?', [false, loggedInId], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Change password
apiManager.changePassword = (adminId, id, params, callback) => {
  
  var user = {
    password: params.password,
    last_modified_by: adminId,
    last_modified_at: rightNow
  };
  connection.query('UPDATE user SET ? WHERE user_id = ?', [user, id], (err, result) => {
    if (err) {
      callback(err);
    }

    callback(null, result);
  });
};

// Create a new user
apiManager.createUser = (adminId, params, callback) => {
  var randomLength = chance.integer({ min: 8, max: 10 });
  var defaultPassword = chance.string({ length: randomLength });
  var user = {
    react_id: rightNow,
    first_name: params.firstname,
    last_name: params.lastname,
    username: params.username,
    password: defaultPassword,
    role: params.role,
    manager_user_id: params.managerid,
    first_login: true,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  
  connection.query('INSERT INTO user SET ?', user, (err, result) => {
    if (err) {
      callback(err);
    }

    apiManager.sendEmailWithPassword(defaultPassword, (err, sent) => {
      if (err) {
        console.error('There was an error sending the email: ' + err);
      }
  
      callback(null, result);
    });
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
apiManager.updateUser = (adminId, id, params, callback) => {
  var user = {
    react_id: rightNow,
    first_name: params.firstname,
    last_name: params.lastname,
    username: params.username,
    role: params.role,
    manager_user_id: params.managerid,
    last_modified_at: rightNow,
    last_modified_by: adminId,
  };
  connection.query('UPDATE user SET ? WHERE user_id = ?', [user, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a user
apiManager.deleteUser = (adminId, id, callback) => {
  var user = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE user SET ? WHERE user_id = ?', [user, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// STUDENTS
// Create a student
apiManager.createStudent = (adminId, params, callback) => {
  var student = {
    react_id: rightNow,
    first_name: params.firstname,
    last_name: params.lastname,
    gender: params.gender,
    ethnicity: params.ethnicity,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
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

// Get students by user
apiManager.getStudentsByUser = (id, callback) => {
  connection.query('SELECT * FROM vw_student WHERE school_id in (SELECT school_id FROM school_user WHERE active = ? AND user_id = ?)',
  [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get student access by user
apiManager.getStudentAccessByUser = (userId, studentId, callback) => {
  connection.query('SELECT access_type FROM school_user WHERE active = ? AND user_id = ? AND student_id = (SELECT school_id FROM vw_student WHERE student_id = ?)',
  [true, userId, studentId], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a student
apiManager.updateStudent = (adminId, id, params, callback) => {
  var student = {
    react_id: rightNow,
    first_name: params.firstname,
    last_name: params.lastname,
    gender: params.gender,
    ethnicity: params.ethnicity,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE student SET ? WHERE student_id = ?', [student, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a student
apiManager.deleteStudent = (adminId, id, callback) => {
  var student = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE student SET active = ? WHERE student_id = ?', [student, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// STUDENT ASSESSMENT SCORES
// Get all student scores
apiManager.getAllStudentScores = (callback) => {
  connection.query('SELECT * FROM assessment_score WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a specific score
apiManager.getStudentScore = (id, callback) => {
  connection.query('SELECT * FROM assessment_score WHERE active = ? AND score_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get score for a student
apiManager.getStudentScoreByStudent = (id, callback) => {
  connection.query('SELECT * FROM assessment_score WHERE active = ? AND student_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Create a score
apiManager.createStudentScore = (adminId, id, params, callback) => {
  var score = {
    student_id: id,
    react_id: rightNow,
    score_type: params.scoretype,
    score_value: params.score,
    assessment_date: params.date,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO assessment_score SET ?', score, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a score
apiManager.updateStudentScore = (adminId, id, params, callback) => {
  var score = {
    react_id: rightNow,
    score_type: params.scoretype,
    score_value: params.score,
    assessment_date: params.date,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE assessment_score SET ? WHERE score_id = ?', [score, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a score
apiManager.deleteStudentScore = (adminId, id, params, callback) => {
  var score = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE assessment_score SET active = ? WHERE score_id = ?', [score, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// PRESENTING PROBLEM
// Get all problems
apiManager.getAllPresentingProblems = (callback) => {
  connection.query('SELECT * FROM presenting_problem WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a specific problem
apiManager.getPresentingProblem = (id, callback) => {
  connection.query('SELECT * FROM presenting_problem WHERE active = ? AND problem_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get problem by student
apiManager.getPresentingProblemByStudent = (id, callback) => {
  connection.query('SELECT * FROM presenting_problem WHERE active = ? AND student_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Create a presenting problem
apiManager.createPresentingProblem = (adminId, id, params, callback) => {
  var problem = {
    student_id: id,
    react_id: rightNow,
    problem_type: params.problemtype,
    date_identified: rightNow,
    resolved: false,
    resolution_date: rightNow,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO presenting_problem SET ?', problem, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a presenting problem
apiManager.updatePresentingProblem = (adminId, id, params, callback) => {
  var problem = {
    react_id: rightNow,
    problem_type: params.problemtype,
    date_identified: rightNow,
    resolved: params.resolved,
    resolution_date: rightNow,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE presenting_problem SET ? WHERE problem_id = ?', [problem, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a presenting problem
apiManager.deletePresentingProblem = (adminId, id, params, callback) => {
  var problem = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE presenting_problem SET active = ? WHERE problem_id = ?', [problem, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// TREATMENT CONCERNS
// Get all concerns
apiManager.getAllTreatmentConcerns = (callback) => {
  connection.query('SELECT * FROM treatment_concern WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a specific concern
apiManager.getTreatmentConcern = (id, callback) => {
  connection.query('SELECT * FROM treatment_concern WHERE active = ? AND concern_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get concern by student
apiManager.getTreatmentConcernByStudent = (id, callback) => {
  connection.query('SELECT * FROM treatment_concern WHERE active = ? AND student_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Create a treatment concern
apiManager.createTreatmentConcern = (adminId, id, params, callback) => {
  var concern = {
    student_id: id,
    react_id: rightNow,
    concern_type: params.concerntype,
    date_identified: rightNow,
    resolved: false,
    resolution_date: rightNow,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO treatment_concern SET ?', concern, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a treatment concern
apiManager.updateTreatmentConcern = (adminId, id, params, callback) => {
  var concern = {
    react_id: rightNow,
    problem_type: params.concerntype,
    date_identified: rightNow,
    resolved: params.resolved,
    resolution_date: rightNow,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE treatment_concern SET ? WHERE concern_id = ?', [concern, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a treatment concern
apiManager.deleteTreatmentConcern = (adminId, id, params, callback) => {
  var concern = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE treatment_concern SET active = ? WHERE concern_id = ?', [concern, id], (err, result) => {
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
apiManager.createStudentGrade = (adminId, id, params, callback) => {
  var grade = {
    student_id: id,
    react_id: rightNow,
    grade: params.grade,
    school: params.school,
    therapist: params.therapist,
    started_at: rightNow,
    referral_source: params.source,
    free_reduced_lunch: params.lunch,
    school_year: params.year,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO student_grade SET ?', grade, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update student grade
apiManager.updateStudentGrade = (adminId, id, params, callback) => {
  var grade = {
    student_id: id,
    react_id: rightNow,
    grade: params.grade,
    school: params.school,
    therapist: params.therapist,
    referral_source: params.source,
    free_reduced_lunch: params.lunch,
    school_year: params.year,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE student_grade SET ? WHERE student_id = ?', [grade, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete student grade
apiManager.deleteStudentGrade = (adminId, id, callback) => {
  var grade = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE student_grade SET active = ? WHERE student_grade_id = ?', [grade, id], (err, result) => {
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
apiManager.createStudentNote = (adminId, id, params, callback) => {
  var note = {
    student_id: id,
    react_id: rightNow,
    note: params.note,
    posted_at: rightNow,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO student_note SET ?', note, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a student note
apiManager.updateStudentNote = (adminId, id, params, callback) => {
  var note = {
    student_id: id,
    react_id: rightNow,
    note: params.note,
    posted_at: params.posted,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE student_note SET ? WHERE student_id = ?', [note, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a student note
apiManager.deleteStudentNote = (adminId, id, callback) => {
  var note = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE student_note SET active = ? WHERE student_id = ?', [note, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// SCHOOL
// Create a school
apiManager.createSchool = (adminId, params, callback) => {
  var school = {
    react_id: rightNow,
    school_name: params.name,
    address: params.address,
    principal: params.principal,
    primary_contact: params.primaryContact,
    primary_contact_email: params.contactEmail,
    school_district: params.district,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true 
  };
  
  connection.query('INSERT INTO school SET ?', school, (err, result) => {
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

// Get schools by user access type
apiManager.getSchoolAccessByUser = (userId, schoolId, callback) => {
  connection.query('SELECT access_type FROM school_user WHERE active = ? AND user_id = ? AND school_id = ?',
  [true, userId, schoolId], (err, result) => {
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
apiManager.updateSchool = (adminId, id, params, callback) => {
  var school = {
    react_id: rightNow,
    school_name: params.name,
    address: params.address,
    principal: params.principal,
    primary_contact: params.primaryContact,
    primary_contact_email: params.contactEmail,
    school_district: params.district,
    last_modified_at: rightNow,
    last_modified_by: adminId 
  };
  connection.query('UPDATE school SET ? WHERE school_id = ?', [school, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a school
apiManager.deleteSchool = (adminId, id, callback) => {
  var school = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId 
  };
  connection.query('UPDATE school SET active = ? WHERE school_id = ?', [school, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};



// EVENTS
// Create an event
apiManager.createEvent = (adminId, id, params, callback) => {
  var event = {
    school_id: id,
    react_id: rightNow,
    event_name: params.name,
    event_type: params.type,
    event_other: params.other,
    event_description: params.description,
    iep_minutes: params.iepMinutes,
    number_of_attendees: params.attendees,
    event_date: params.date,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
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
apiManager.updateEvent = (adminId, id, params, callback) => {
  var event = {
    school_id: params.schoolId,
    react_id: rightNow,
    event_name: params.name,
    event_type: params.type,
    event_other: params.other,
    event_description: params.description,
    iep_minutes: params.iepMinutes,
    number_of_attendees: params.attendees,
    event_date: params.date,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE event SET ? WHERE event_id = ?', [event, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete an event
apiManager.deleteEvent = (adminId, id, callback) => {
  var event = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE event SET active = ? WHERE event_id = ?', [event, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// EVENT FILES
// Get all event files
apiManager.getAllEventFiles = (callback) => {
  connection.query('SELECT * FROM event_file WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get all files for an event
apiManager.getEventFilesForEvent = (id, callback) => {
  connection.query('SELECT * FROM event_file WHERE active = ? AND event_id = ?', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get a specific event file
apiManager.getEventFile = (id, callback) => {
  connection.query('SELECT * FROM event_file WHERE active = ? AND event_file_id', [true, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Attach a file to an event
apiManager.createEventFile = (adminId, id, params, callback) => {
  var fileDetails = {
    event_id: id,
    react_id: rightNow,
    file_description: params.description,
    file_url: params.url,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO event_file SET ?', fileDetails, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update event file details
apiManager.updateEventFile = (adminId, id, params, callback) => {
  var fileDetails = {
    react_id: rightNow,
    file_description: params.description,
    file_url: params.url,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE event_file SET ? WHERE event_file_id = ?', [fileDetails, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete file for an event
apiManager.deleteEventFile = (adminId, id, params, callback) => {
  var fileDetails = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE event_file SET active = ? WHERE event_file_id = ?', [fileDetails, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// EVENT ATTENDANCE
// Get all event attendances
apiManager.getAllEventAttendances = (callback) => {
  connection.query('SELECT * FROM event_attendance WHERE active = ?', true, schoolUser, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get attendance by event
apiManager.getEventAttendanceByEvent = (id, callback) => {
  connection.query('SELECT * FROM event_attendance WHERE active = ? AND event_id = ?', [true, id], schoolUser, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get attendance by student
apiManager.getEventAttendanceByStudent = (id, callback) => {
  connection.query('SELECT * FROM event_attendance WHERE active = ? AND student_id = ?', [true, id], schoolUser, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Create event attendance
apiManager.createEventAttendance = (adminId, params, callback) => {
  var attendance = {
    event_id: params.eventid,
    student_id: params.studentid,
    react_id: rightNow,
    attendee_name: params.name,
    attendee_email: params.email,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO event_attendance SET ?', attendance, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update event attendance
apiManager.updateEventAttendance = (adminId, eventid, studentid, params, callback) => {
  var attendance = {
    event_id: params.eventid,
    student_id: params.studentid,
    react_id: rightNow,
    attendee_name: params.name,
    attendee_email: params.email,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE event_attendance SET ? WHERE event_id = ? AND student_id = ?', [attendance, eventid, studentid], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete event attendance
apiManager.updateEventAttendance = (adminId, eventid, studentid, params, callback) => {
  var attendance = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE event_attendance SET active = ? WHERE event_id = ? AND student_id = ?', [attendance, eventid, studentid], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// SCHOOL USER
// Get all school user relationships
apiManager.getAllSchoolUsers = (callback) => {
  connection.query('SELECT * FROM school_user WHERE active = ?', true, schoolUser, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get user school by user
apiManager.getSchoolUsersByUser = (id, callback) => {
  connection.query('SELECT * FROM school_user WHERE active = ? AND user_id = ?', [true, id], schoolUser, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get user school by school
apiManager.getSchoolUsersBySchool = (id, callback) => {
  connection.query('SELECT * FROM school_user WHERE active = ? AND school_id = ?', [true, id], schoolUser, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Create school user relationship
apiManager.createSchoolUser = (adminId, params, callback) => {
  var schoolUser = {
    user_id: params.userid,
    school_id: params.schoolid,
    react_id: rightNow,
    access_type: params.access,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO school_user SET ?', schoolUser, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update school user relationship
apiManager.updateSchoolUser = (adminId, userid, schoolid, params, callback) => {
  var schoolUser = {
    react_id: rightNow,
    access_type: params.access,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE school_user SET ? WHERE user_id = ? AND school_id = ?', [schoolUser, userid, schoolid], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete school user entry
apiManager.deleteSchoolUser = (adminId, userid, schoolid, callback) => {
  var schoolUser = {
    ractive: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE school_user SET active = ? WHERE user_id = ? AND school_id = ?', [schoolUser, userid, schoolid], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// FORM FIELDS
// Get all form fields
apiManager.getAllFormFields = (callback) => {
  connection.query('SELECT * FROM form_field WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    callback(null, result);
  });
};

// Get all form field names
apiManager.getAllFormFieldNames = (callback) => {
  connection.query('SELECT * FROM form_field_name WHERE active = ?', true, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Get  form field name by id
apiManager.getFormFieldNamebyid= (callback) => {
  connection.query('SELECT * FROM form_field_name WHERE active = ? and field_name_id=?', true, (err, result) => {
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
  connection.query('SELECT FF.field_id, FF.field_value FROM form_field FF INNER JOIN form_field_name FFN WHERE FF.active = ? AND FF.field_name_id=FFn.field_name_id AND FFN.field_name = ?', [true, name], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Add a form field
apiManager.createFormField = (adminId, params, callback) => {
  var field = {
    react_id: rightNow,
    field_name_id: params.field_name_id,
    field_value: params.value,
    created_at: rightNow,
    created_by: adminId,
    last_modified_at: rightNow,
    last_modified_by: adminId,
    active: true
  };
  connection.query('INSERT INTO from_field SET ?', field, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a form field
apiManager.updateFormField = (adminId, id, params, callback) => {
  var field = {
    react_id: rightNow,
    field_name_id: params.field_name_id,
    field_value: params.value,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE form_field SET ? WHERE field_id = ?', [field, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a form field
apiManager.deleteFormField = (adminId, id, callback) => {
  var field = {
    active: false,
    last_modified_at: rightNow,
    last_modified_by: adminId
  };
  connection.query('UPDATE form_field SET active = ? WHERE field_id = ?', [field, id], (err, resulr) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};


// Student timeline
apiManager.getStudentTimeline = (id, callback) => {
  connection.query('SELECT * FROM student_timeline WHERE student_id = ?', id, (err, result) => {
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
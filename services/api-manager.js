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
apiManager.createStudentScore = (id, params, callback) => {
  var score = {
    student_id: id,
    react_id: rightNow,
    score_type: params.scoretype,
    score_value: params.score,
    assessment_date: params.date,
    created_at: rightNow,
    created_by: params.createdby,
    last_modified_at: rightNow,
    last_modified_by: params.modifiedby,
    active: true
  };
  connection.query('INSERT INTO assessment_score VALUES ?', score, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a score
apiManager.updateStudentScore = (id, params, callback) => {
  var score = {
    react_id: rightNow,
    score_type: params.scoretype,
    score_value: params.score,
    assessment_date: params.date,
    last_modified_at: rightNow,
    last_modified_by: params.modifiedby
  };
  connection.query('UPDATE assessment_score SET ? WHERE score_id = ?', [score, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a score
apiManager.deleteStudentScore = (id, params, callback) => {
  connection.query('UPDATE assessment_score SET active = ? WHERE score_id = ?', [false, id], (err, result) => {
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
apiManager.createPresentingProblem = (id, params, callback) => {
  var problem = {
    student_id: id,
    react_id: rightNow,
    problem_type: params.problemtype,
    date_identified: rightNow,
    resolved: false,
    resolution_date: rightNow,
    created_at: rightNow,
    created_by: params.createdby,
    last_modified_at: rightNow,
    last_modified_by: params.modifiedby,
    active: true
  };
  connection.query('INSERT INTO presenting_problem VALUES ?', problem, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a presenting problem
apiManager.updatePresentingProblem = (id, params, callback) => {
  var problem = {
    react_id: rightNow,
    problem_type: params.problemtype,
    date_identified: rightNow,
    resolved: params.resolved,
    resolution_date: rightNow,
    last_modified_at: rightNow,
    last_modified_by: params.modifiedby
  };
  connection.query('UPDATE presenting_problem SET ? WHERE problem_id = ?', [problem, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a presenting problem
apiManager.deletePresentingProblem = (id, params, callback) => {
  connection.query('UPDATE presenting_problem SET active = ? WHERE problem_id = ?', [false, id], (err, result) => {
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
apiManager.createTreatmentConcern = (id, params, callback) => {
  var concern = {
    student_id: id,
    react_id: rightNow,
    concern_type: params.concerntype,
    date_identified: rightNow,
    resolved: false,
    resolution_date: rightNow,
    created_at: rightNow,
    created_by: params.createdby,
    last_modified_at: rightNow,
    last_modified_by: params.modifiedby,
    active: true
  };
  connection.query('INSERT INTO treatment_concern VALUES ?', concern, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update a treatment concern
apiManager.updateTreatmentConcern = (id, params, callback) => {
  var concern = {
    react_id: rightNow,
    problem_type: params.concerntype,
    date_identified: rightNow,
    resolved: params.resolved,
    resolution_date: rightNow,
    last_modified_at: rightNow,
    last_modified_by: params.modifiedby
  };
  connection.query('UPDATE treatment_concern SET ? WHERE concern_id = ?', [concern, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete a treatment concern
apiManager.deleteTreatmentConcern = (id, params, callback) => {
  connection.query('UPDATE treatment_concern SET active = ? WHERE concern_id = ?', [false, id], (err, result) => {
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
apiManager.createEventFile = (id, params, callback) => {
  var fileDetails = {
    event_id: id,
    file_description: params.description,
    file_url: params.url,
    created_at: rightNow,
    created_by: 'admin',
    last_modified_at: rightNow,
    last_modified_by: 'admin',
    active: true
  };
  connection.query('INSERT INTO event_file VALUES ?', fileDetails, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update event file details
apiManager.updateEventFile = (id, params, callback) => {
  var fileDetails = {
    file_description: params.description,
    file_url: params.url,
    last_modified_at: rightNow,
    last_modified_by: 'admin'
  };
  connection.query('UPDATE event_file SET ? WHERE event_file_id = ?', [fileDetails, id], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete file for an event
apiManager.deleteEventFile = (id, params, callback) => {
  connection.query('UPDATE event_file SET active = ? WHERE event_file_id = ?', [false, id], (err, result) => {
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
apiManager.createEventAttendance = (params, callback) => {
  var attendance = {
    event_id: params.eventid,
    student_id: params.studentid,
    react_id: rightNow,
    attendee_name: params.name,
    attendee_email: params.email,
    created_at: rightNow,
    created_by: params.createdby,
    last_modified_at: rightNow,
    last_modified_by: params.modifiedby,
    active: true
  };
  connection.query('INSERT INTO event_attendance VALUES ?', attendance, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update event attendance
apiManager.updateEventAttendance = (eventid, studentid, params, callback) => {
  var attendance = {
    event_id: params.eventid,
    student_id: params.studentid,
    react_id: rightNow,
    attendee_name: params.name,
    attendee_email: params.email,
    last_modified_at: rightNow,
    last_modified_by: params.modifiedby
  };
  connection.query('UPDATE event_attendance SET ? WHERE event_id = ? AND student_id = ?', [attendance, eventid, studentid], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete event attendance
apiManager.updateEventAttendance = (eventid, studentid, params, callback) => {
  connection.query('UPDATE event_attendance SET active = ? WHERE event_id = ? AND student_id = ?', [false, eventid, studentid], (err, result) => {
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
apiManager.createSchoolUser = (params, callback) => {
  var schoolUser = {
    user_id: params.userid,
    school_id: params.schoolid,
    access_type: params.access,
    created_at: rightNow,
    created_by: 'admin',
    last_modified_at: rightNow,
    last_modified_by: 'admin',
    active: true
  };
  connection.query('INSERT INTO school_user VALUES ?', schoolUser, (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Update school user relationship
apiManager.updateSchoolUser = (userid, schoolid, params, callback) => {
  var schoolUser = {
    access_type: params.access,
    last_modified_at: rightNow,
    last_modified_by: 'admin'
  };
  connection.query('UPDATE school_user SET ? WHERE user_id = ? AND school_id = ?', [schoolUser, userid, schoolid], (err, result) => {
    if (err) {
      callback(err);
    }
    
    callback(null, result);
  });
};

// Delete school user entry
apiManager.deleteSchoolUser = (userid, schoolid, callback) => {
  connection.query('UPDATE school_user SET active = ? WHERE user_id = ? AND school_id = ?', [false, userid, schoolid], (err, result) => {
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

// Get all form field names
apiManager.getAllFormFieldNames = (callback) => {
  connection.query('SELECT DISTINCT field_name FROM form_field WHERE active = ?', true, (err, result) => {
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
  connection.query('SELECT field_value FROM form_field WHERE active = ? AND field_name = ?', [true, name], (err, result) => {
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
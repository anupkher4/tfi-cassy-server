var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

// STUDENTS
// GET all students
router.get('/', (req, res, next) => {
  apiManager.allStudents((err, result) => {
    if (err) {
      console.error(`Error getting all students ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET student by studentid
router.get('/:studentid', (req, res, next) => {
  apiManager.getStudent(req.params.studentid, (err, result) => {
    if (err) {
      console.error(`Could not find user with userid ${req.params.studentid} ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create a new student
router.post('/', (req, res, next) => {
  apiManager.createStudent(req.body, (err, result) => {
    if (err) {
      console.error(`Could not create student ${err}`);
    }
    
    console.log(`Student created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a student
router.put('/:studentid', (req, res, next) => {
  apiManager.updateStudent(req.params.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not find user with userid ${req.params.studentid} ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a student
router.delete('/:studentid', (req, res, next) => {
  apiManager.deleteStudent(req.params.studentid, (err, result) => {
    if (err) {
      console.error(`Could not delete student with ${req.params.studentid} ${err}`);
    }
    
    res.status(200).send('Deleted ' + result.affectedRows + ' rows')
  });
});



// STUDENT SCORES
// GET all student scores
router.get('/scores', (req, res, next) => {
  apiManager.getAllStudentScores((err, result) => {
    if (err) {
      console.error(`Error getting all student scores ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a specific score
router.get('/scores/:scoreid', (req, res, next) => {
  apiManager.getStudentScore(req.params.scoreid, (err, result) => {
    if (err) {
      console.error(`Error getting student score id ${req.params.scoreid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET score for a student
router.get('/students/:studentid/scores', (req, res, next) => {
  apiManager.getStudentScoreByStudent(req.params.studentid, (err, result) => {
    if (err) {
      console.error(`Error getting score for student id ${req.params.studentid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create a student score


// STUDENT GRADES
// GET all student grades
router.get('/grades', (req, res, next) => {
  apiManager.getAllStudentGrades((err, result) => {
    if (err) {
      console.error(`Error getting all student grades ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a student grade by id
router.get('/grades/:gradeid', (req, res, next) => {
  apiManager.getStudentGrade(req.prams.gradeid, (err, result) => {
    if (err) {
      console.error(`Error getting student grade id ${req.prams.gradeid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a student grade by student id
router.get('/:studentid/grades', (req, res, next) => {
  apiManager.getStudentGradeByStudent(req.prams.studentid, (err, result) => {
    if (err) {
      console.error(`Error getting student grade id ${req.prams.studentid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create a new student grade
router.post('/:studentid/grades', (req, res, next) => {
  apiManager.createStudentGrade(req.prams.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not create student grade with student id ${req.prams.studentid}, Error ${err}`);
    }
    
    console.log(`Student grade created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a student grade
router.post('/:studentid/grades', (req, res, next) => {
  apiManager.updateStudentGrade(req.prams.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not update student grade with student id ${req.prams.studentid}, Error ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a student grade
router.delete('/grades/:gradeid', (req, res, next) => {
  apiManager.deleteStudentGrade(req.params.gradeid, (err, result) => {
    if (err) {
      console.error(`Could not delete student grade id ${req.params.gradeid} ${err}`);
    }
    
    res.status(200).send('Deleted ' + result.affectedRows + ' rows')
  });
});



// STUDENT NOTES
// GET all student notes
router.get('/notes', (req, res, next) => {
  apiManager.getAllStudentNotes((err, result) => {
    if (err) {
      console.error(`Error getting all student notes ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a student note by id
router.get('/notes/:noteid', (req, res, next) => {
  apiManager.getStudentNote(req.prams.noteid, (err, result) => {
    if (err) {
      console.error(`Error getting student note id ${req.prams.noteid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a student note by student id
router.get('/:studentid/notes', (req, res, next) => {
  apiManager.getStudentNoteByStudent(req.prams.studentid, (err, result) => {
    if (err) {
      console.error(`Error getting student note id ${req.prams.studentid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create a new student note
router.post('/:studentid/notes', (req, res, next) => {
  apiManager.createStudentNote(req.prams.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not create student note with student id ${req.prams.studentid}, Error ${err}`);
    }
    
    console.log(`Student note created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a student note
router.post('/:studentid/notes', (req, res, next) => {
  apiManager.updateStudentNote(req.prams.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not update student note with student id ${req.prams.studentid}, Error ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a student note
router.delete('/notes/:noteid', (req, res, next) => {
  apiManager.deleteStudentNote(req.params.noteid, (err, result) => {
    if (err) {
      console.error(`Could not delete student note id ${req.params.gradeid} ${err}`);
    }
    
    res.status(200).send('Deleted ' + result.affectedRows + ' rows')
  });
});


module.exports = router;
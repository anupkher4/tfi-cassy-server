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

// GET student timeline
router.get('/:studentid/timeline', (req, res, next) => {
  apiManager.getStudentTimeline(req.params.studentid, (err, result) => {
    if (err) {
      console.error(`Error getting timeline for student id ${req.params.studentid}, Error ${err}`);
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
  apiManager.createStudent(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
    if (err) {
      console.error(`Could not create student ${err}`);
    }
    
    console.log(`Student created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a student
router.put('/:studentid', (req, res, next) => {
  apiManager.updateStudent(JSON.stringify(req.user[0].user_id), req.params.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not find user with userid ${req.params.studentid} ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a student
router.delete('/:studentid', (req, res, next) => {
  apiManager.deleteStudent(JSON.stringify(req.user[0].user_id), req.params.studentid, (err, result) => {
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
router.post('/scores', (req, res, next) => {
  apiManager.createStudentScore(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
    if (err) {
      console.error(`There was an error creating student score ${err}`);
    }
    
    console.log(`Student score created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a student score
router.put('/scores/:scoreid', (req, res, next) => {
  apiManager.updateStudentScore(JSON.stringify(req.user[0].user_id), req.params.scoreid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not update student score id ${req.prams.scoreid}, Error ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a student score
router.delete('/scores/:scoreid', (req, res, next) => {
  apiManager.deleteStudentScore(JSON.stringify(req.user[0].user_id), req.params.scoreid, (err, result) => {
    if (err) {
      console.error(`Could not delete student score id ${req.params.scoreid}, Error ${err}`);
    }
    
    res.status(200).send('Deleted ' + result.affectedRows + ' rows')
  });
});



// PRESENTING PROBLEMS
// GET all presenting problems
router.get('/problems', (req, res, next) => {
  apiManager.getAllPresentingProblems((err, result) => {
    if (err) {
      console.error(`Error getting all presenting problems ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a specific problem
router.get('/problems/:problemid', (req, res, next) => {
  apiManager.getPresentingProblem(req.params.problemid, (err, result) => {
    if (err) {
      console.error(`Error getting presenting problem id ${req.params.problemid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET presenting problems for a student
router.get('/students/:studentid/problems', (req, res, next) => {
  apiManager.getPresentingProblemByStudent(req.params.studentid, (err, result) => {
    if (err) {
      console.error(`Error getting presenting problem for student id ${req.params.studentid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create a presenting problem
router.post('/problems', (req, res, next) => {
  apiManager.createPresentingProblem(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
    if (err) {
      console.error(`There was an error creating presenting problem ${err}`);
    }
    
    console.log(`Presenting problem created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a presenting problem
router.put('/problems/:problemid', (req, res, next) => {
  apiManager.updatePresentingProblem(JSON.stringify(req.user[0].user_id), req.params.problemid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not update presenting problem id ${req.prams.problemid}, Error ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a presenting problem
router.delete('/problems/:problemid', (req, res, next) => {
  apiManager.deletePresentingProblem(JSON.stringify(req.user[0].user_id), req.params.problemid, (err, result) => {
    if (err) {
      console.error(`Could not delete presenting problem id ${req.params.problemid}, Error ${err}`);
    }
    
    res.status(200).send('Deleted ' + result.affectedRows + ' rows')
  });
});



// TREATMENT CONCERNS
// GET all treatment concerns
router.get('/concerns', (req, res, next) => {
  apiManager.getAllTreatmentConcerns((err, result) => {
    if (err) {
      console.error(`Error getting all treatment concerns ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a treatment concern
router.get('/concerns/:concernid', (req, res, next) => {
  apiManager.getTreatmentConcern(req.params.concernid, (err, result) => {
    if (err) {
      console.error(`Error getting treatment concern id ${req.params.concernid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET treatment concerns for a student
router.get('/students/:studentid/concerns', (req, res, next) => {
  apiManager.getTreatmentConcernByStudent(req.params.studentid, (err, result) => {
    if (err) {
      console.error(`Error getting treatment concern for student id ${req.params.studentid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create a treatment concern
router.post('/concerns', (req, res, next) => {
  apiManager.createTreatmentConcern(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
    if (err) {
      console.error(`There was an error creating treatment concern ${err}`);
    }
    
    console.log(`Treatment concern created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a treatment concern
router.put('/concerns/:concernid', (req, res, next) => {
  apiManager.updateTreatmentConcern(JSON.stringify(req.user[0].user_id), req.params.concernid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not update treatment concern id ${req.prams.concernid}, Error ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a treatment concern
router.delete('/concerns/:concernid', (req, res, next) => {
  apiManager.deleteTreatmentConcern(JSON.stringify(req.user[0].user_id), req.params.concernid, (err, result) => {
    if (err) {
      console.error(`Could not delete treatment concern id ${req.params.concernid}, Error ${err}`);
    }
    
    res.status(200).send('Deleted ' + result.affectedRows + ' rows')
  });
});



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
  apiManager.createStudentGrade(JSON.stringify(req.user[0].user_id), req.prams.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not create student grade with student id ${req.prams.studentid}, Error ${err}`);
    }
    
    console.log(`Student grade created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a student grade
router.post('/:studentid/grades', (req, res, next) => {
  apiManager.updateStudentGrade(JSON.stringify(req.user[0].user_id), req.prams.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not update student grade with student id ${req.prams.studentid}, Error ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a student grade
router.delete('/grades/:gradeid', (req, res, next) => {
  apiManager.deleteStudentGrade(JSON.stringify(req.user[0].user_id), req.params.gradeid, (err, result) => {
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
  apiManager.createStudentNote(JSON.stringify(req.user[0].user_id), req.prams.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not create student note with student id ${req.prams.studentid}, Error ${err}`);
    }
    
    console.log(`Student note created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a student note
router.post('/:studentid/notes', (req, res, next) => {
  apiManager.updateStudentNote(JSON.stringify(req.user[0].user_id), req.prams.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Could not update student note with student id ${req.prams.studentid}, Error ${err}`);
    }
    
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a student note
router.delete('/notes/:noteid', (req, res, next) => {
  apiManager.deleteStudentNote(JSON.stringify(req.user[0].user_id), req.params.noteid, (err, result) => {
    if (err) {
      console.error(`Could not delete student note id ${req.params.gradeid} ${err}`);
    }
    
    res.status(200).send('Deleted ' + result.affectedRows + ' rows')
  });
});


module.exports = router;
var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

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
    
    res.status(201).send('Updated ' + result.changedRows + ' rows');
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

module.exports = router;
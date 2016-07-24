var express = require('express');
var router = express.Router();

// GET all students
router.get('/', (req, res, next) => {
  res.send('a list of all students');
});

// GET student by studentid
router.get('/:studentid', (req, res, next) => {
  res.send('user with studentid' + req.params);
});

// POST create a new student
router.post('/', (req, res, next) => {
  res.statusCode = 201;
  res.send('student created');
});

// PUT update a student
router.put('/:studentid', (req, res, next) => {
  res.statusCode = 200;
  res.send('student updated');
});

// DELETE a student
router.delete('/:studentid', (req, res, next) => {
  res.send('student deleted' + req.params)
});

module.exports = router;
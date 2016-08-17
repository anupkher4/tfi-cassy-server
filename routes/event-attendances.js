var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');


// EVENT ATTENDANCE
// GET all event attendances
router.get('/', (req, res, next) => {
  apiManager.getAllEventAttendances((err, result) => {
    if (err) {
      console.error(`Error getting all attendances ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET event attendances by event
router.get('/events/:eventid', (req, res, next) => {
  apiManager.getEventAttendanceByEvent(req.params.eventid, (err, result) => {
    if (err) {
      console.error(`Error getting event attendance with event id ${req.params.eventid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET event attendances by student
router.get('/students/:studentid', (req, res, next) => {
  apiManager.getEventAttendanceByStudent(req.params.studentid, (err, result) => {
    if (err) {
      console.error(`Error getting event attendance with student id ${req.params.studentid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create event attendance
router.post('/', (req, res, next) => {
  apiManager.createEventAttendance(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
    if (err) {
      console.error(`Error creating event attendance ${err}`);
    }
    
    res.status(201).send(result);
  });
});

// PUT update event attendance
router.put('/events/:eventid/students/:studentid', (req, res, next) => {
  apiManager.updateEventAttendance(JSON.stringify(req.user[0].user_id), req.params.eventid, req.params.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Error updating school user userid:${req.params.eventid} schoolid:${req.params.studentid}, Error ${err}`);
    }
    
    res.status(200).send(`Updated ${result.changedRows} rows`);
  });
});

// DELETE school user
router.delete('/events/:eventid/students/:studentid', (req, res, next) => {
  apiManager.deleteEventAttendance(JSON.stringify(req.user[0].user_id), req.params.eventid, req.params.studentid, req.body, (err, result) => {
    if (err) {
      console.error(`Error deleting school user userid:${req.params.eventid} schoolid:${req.params.studentid}, Error ${err}`);
    }
    
    res.status(200).send(`Deleted ${result.affectedRows} rows`);
  });
});


module.exports = router;
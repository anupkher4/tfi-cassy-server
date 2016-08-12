var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

// GET all schools
router.get('/', (req, res, next) => {
  apiManager.getAllSchools((err, result) => {
    if (err) {
      console.error(`There was an error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a specific school
router.get('/:schoolid', (req, res, next) => {
  apiManager.getSchool(req.params.schoolid, (err, result) => {
    if (err) {
      console.error(`No school with school id ${req.params.schoolid}. Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST Create a school
router.post('/', (req, res, next) => {
  apiManager.createSchool(req.body, (err, result) => {
    if (err) {
      console.error(`There was an error creating school ${err}`);
    }
    
    console.log(`School created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT Update a school
router.put('/:schoolid', (req, res, next) => {
  apiManager.updateSchool(req.params.schoolid, req.body, (err, result) => {
    if (err) {
      console.error(`Error updating school id ${req.params.schoolid}`);
    }
    
    console.log('School updated');
    res.status(200).send(`Updated ${result.changedRows} rows`);
  });
});

// DELETE school
router.delete('/:schoolid', (req, res, next) => {
  apiManager.deleteSchool(req.params.schoolid, (err, result) => {
    if (err) {
      console.error(`Error deleting school id ${req.params.schoolid}`);
    }
    
    console.log('School deleted');
    res.status(200).send(`Deleted ${result.affectedRows} rows`);
  });
});

// POST Create an event
router.post('/:schoolid/events', (req, res, next) => {
  apiManager.createEvent(req.params.schoolid, req.body, (err, result) => {
    if (err) {
      console.error(`Error creating event with school id ${req.params.schoolid}, Error ${err}`);
    }
    
    console.log(`Created event with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// GET all events
router.get('/', (req, res, next) => {
  apiManager.getAllEvents((err, result) => {
    if (err) {
      console.error('Error getting events');
    }
    
    res.status(200).send(result);
  });
});

// GET all events for a school
router.get('/:schoolid', (req, res, next) => {
  apiManager.getSchoolEvents(req.params.schoolid, (err, result) => {
    if (err) {
      console.error(`Error getting events for school id ${req.params.schoolid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a specific event
router.get('/:eventid', (req, res, next) => {
  apiManager.getEvent(req.params.eventid, (err, result) => {
    if (err) {
      console.error(`Error getting event id ${req.params.eventid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// PUT update an event
router.put('/:eventid', (req, res, next) => {
  apiManager.updateEvent(req.params.eventid, req.body, (req, res, next) => {
    if (err) {
      console.error(`Error updating event id ${req.params.eventid}, Error ${err}`);
    }
    
    console.log('Event updated');
    res.status(200).send(`Updated ${result.changedRows} rows`)
  });
});

// DELETE an event
router.put('/:eventid', (req, res, next) => {
  apiManager.deleteEvent(req.params.eventid, (req, res, next) => {
    if (err) {
      console.error(`Error deleting event id ${req.params.eventid}`);
    }
    
    console.log('Event deleted');
    res.status(200).send(`Deleted ${result.affectedRows} rows`);
  });
});

module.exports = router;
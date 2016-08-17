var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

// SCHOOLS
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
  apiManager.createSchool(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
    if (err) {
      console.error(`There was an error creating school ${err}`);
    }
    
    console.log(`School created with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT Update a school
router.put('/:schoolid', (req, res, next) => {
  apiManager.updateSchool(JSON.stringify(req.user[0].user_id), req.params.schoolid, req.body, (err, result) => {
    if (err) {
      console.error(`Error updating school id ${req.params.schoolid}`);
    }
    
    console.log('School updated');
    res.status(200).send(`Updated ${result.changedRows} rows`);
  });
});

// DELETE school
router.delete('/:schoolid', (req, res, next) => {
  apiManager.deleteSchool(JSON.stringify(req.user[0].user_id), req.params.schoolid, (err, result) => {
    if (err) {
      console.error(`Error deleting school id ${req.params.schoolid}`);
    }
    
    console.log('School deleted');
    res.status(200).send(`Deleted ${result.affectedRows} rows`);
  });
});


// SCHOOL EVENTS
// POST Create an event
router.post('/:schoolid/events', (req, res, next) => {
  apiManager.createEvent(JSON.stringify(req.user[0].user_id), req.params.schoolid, req.body, (err, result) => {
    if (err) {
      console.error(`Error creating event with school id ${req.params.schoolid}, Error ${err}`);
    }
    
    console.log(`Created event with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// GET all events
router.get('/events', (req, res, next) => {
  apiManager.getAllEvents((err, result) => {
    if (err) {
      console.error('Error getting events');
    }
    
    res.status(200).send(result);
  });
});

// GET all events for a school
router.get('/:schoolid/events', (req, res, next) => {
  apiManager.getSchoolEvents(req.params.schoolid, (err, result) => {
    if (err) {
      console.error(`Error getting events for school id ${req.params.schoolid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a specific event
router.get('/events/:eventid', (req, res, next) => {
  apiManager.getEvent(req.params.eventid, (err, result) => {
    if (err) {
      console.error(`Error getting event id ${req.params.eventid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// PUT update an event
router.put('/events/:eventid', (req, res, next) => {
  apiManager.updateEvent(JSON.stringify(req.user[0].user_id), req.params.eventid, req.body, (req, res, next) => {
    if (err) {
      console.error(`Error updating event id ${req.params.eventid}, Error ${err}`);
    }
    
    console.log('Event updated');
    res.status(200).send(`Updated ${result.changedRows} rows`)
  });
});

// DELETE an event
router.put('/events/:eventid', (req, res, next) => {
  apiManager.deleteEvent(JSON.stringify(req.user[0].user_id), req.params.eventid, (req, res, next) => {
    if (err) {
      console.error(`Error deleting event id ${req.params.eventid}`);
    }
    
    console.log('Event deleted');
    res.status(200).send(`Deleted ${result.affectedRows} rows`);
  });
});


// EVENT FILES
// POST Create an event file
router.post('/events/:eventid/files', (req, res, next) => {
  apiManager.createEventFile(JSON.stringify(req.user[0].user_id), req.params.eventid, req.body, (err, result) => {
    if (err) {
      console.error(`Error attaching event file with event id ${req.params.eventid}, Error ${err}`);
    }
    
    console.log(`Created event with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// GET all event files
router.get('/events/files/', (req, res, next) => {
  apiManager.getAllSchoolFiles((err, result) => {
    if (err) {
      console.error(`Error getting events files ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET all events for a school
router.get('/events/:eventid/files', (req, res, next) => {
  apiManager.getEventFilesForEvent(req.params.eventid, (err, result) => {
    if (err) {
      console.error(`Error getting events files for event id ${req.params.eventid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a specific event file
router.get('/events/files/:fileid', (req, res, next) => {
  apiManager.getEventFile(req.params.fileid, (err, result) => {
    if (err) {
      console.error(`Error getting event file id ${req.params.fileid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// PUT update an event file
router.put('/events/files/:fileid', (req, res, next) => {
  apiManager.updateEventFile(JSON.stringify(req.user[0].user_id), req.params.fileid, req.body, (req, res, next) => {
    if (err) {
      console.error(`Error updating event id ${req.params.fileid}, Error ${err}`);
    }
    
    console.log('Event updated');
    res.status(200).send(`Updated ${result.changedRows} rows`)
  });
});

// DELETE update an event file
router.delete('/events/files/:fileid', (req, res, next) => {
  apiManager.deleteEventFile(JSON.stringify(req.user[0].user_id), req.params.fileid, req.body, (req, res, next) => {
    if (err) {
      console.error(`Error deleting event id ${req.params.fileid}, Error ${err}`);
    }
    
    console.log('Event deleted');
    res.status(200).send(`Deleted ${result.affectedRows} rows`)
  });
});


module.exports = router;
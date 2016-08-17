var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

// SCHOOL USERS
// GET all school users
router.get('/', (req, res, next) => {
  apiManager.getAllSchoolUsers((err, result) => {
    if (err) {
      console.error(`Error getting all school users ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET school users by user
router.get('/user/:userid', (req, res, next) => {
  apiManager.getSchoolUsersByUser(req.params.userid, (err, result) => {
    if (err) {
      console.error(`Error getting school user with user id ${req.params.userid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET school users by school
router.get('/school/:schoolid', (req, res, next) => {
  apiManager.getSchoolUsersBySchool(req.params.schoolid, (err, result) => {
    if (err) {
      console.error(`Error getting school user with school id ${req.params.schoolid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create school user relationship
router.post('/', (req, res, next) => {
  apiManager.createSchoolUser(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
    if (err) {
      console.error(`Error creating school user ${err}`);
    }
    
    res.status(201).send(result);
  });
});

// PUT update school user
router.put('/user/:userid/school/:schoolid', (req, res, next) => {
  apiManager.updateSchoolUser(JSON.stringify(req.user[0].user_id), req.params.userid, req.params.schoolid, req.body, (err, result) => {
    if (err) {
      console.error(`Error updating school user userid:${req.params.userid} schoolid:${req.params.schoolid}, Error ${err}`);
    }
    
    res.status(200).send(`Updated ${result.changedRows} rows`);
  });
});

// DELETE school user
router.delete('/user/:userid/school/:schoolid', (req, res, next) => {
  apiManager.deleteSchoolUser(JSON.stringify(req.user[0].user_id), req.params.userid, req.params.schoolid, req.body, (err, result) => {
    if (err) {
      console.error(`Error deleting school user userid:${req.params.userid} schoolid:${req.params.schoolid}, Error ${err}`);
    }
    
    res.status(200).send(`Deleted ${result.affectedRows} rows`);
  });
});

module.exports = router;
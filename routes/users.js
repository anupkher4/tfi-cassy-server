var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

// GET all users
router.get('/', (req, res, next) => {
  res.send('a list of all users');
});

// GET user by userid
router.get('/:userid', (req, res, next) => {
  apiManager.getUser(req.params.userid, (err, result) => {
    if (err) {
      console.error('No user for the given id ' + req.params.userid + err);
    }
    
    res.status(200).send(result);
  });
});

// POST create a new user
router.post('/', (req, res, next) => {
  apiManager.createUser(req.body, (err, result) => {
    if (err) {
      console.error('Error creating a new user' + err);
    }
    
    console.log('User inserted with id ' + result.insertId);
    res.status(201).send(result);
  });
});

// PUT update a user
router.put('/:userid', (req, res, next) => {
  apiManager.updateUser(req.params.userid, req.body, (err, result) => {
    if (err) {
      console.error('Could not update user with id ' + req.params.userid + err);
    }
    
    console.log('User updated');
    res.status(201).send('Updated ' + result.changedRows + ' rows');
  });
});

// PUT change user password
router.put('/:userid/change-password', (req, res, next) => {
  apiManager.changePassword(req.params.userid, req.body, (err, result) => {
    if (err) {
      console.error('Error changing user\'s password ' + req.params.userid + err);
    }
    
    console.log('Password updated');
    res.status(200).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a user
router.delete('/:userid', (req, res, next) => {
  apiManager.deleteUser(req.params.userid, (err, result) => {
    if (err) {
      console.error('Error deleting user with id ' + req.params.id);
    }
  
    res.status(200).send('Deleted ' + result.affectedRows + ' rows');
  });
});

module.exports = router;

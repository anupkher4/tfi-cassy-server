var express = require('express');
var router = express.Router();
var apimanager = require('../services/apimanager');

// GET all users
router.get('/', (req, res, next) => {
  res.send('a list of all users');
});

// GET user by userid
router.get('/:userid', (req, res, next) => {
  apimanager.getUser(req.params.userid, (err, result) => {
    if (err) {
      console.error('No user for the given id ' + req.params.userid + err);
    }
    
    res.status(200).send(result);
  });
});

// POST create a new user
router.post('/', (req, res, next) => {
  apimanager.createUser(req.body, (err, result) => {
    if (err) {
      console.error('Error creating a new user' + err);
    }
    
    console.log('User inserted with id ' + result.insertId);
    res.status(201).send(result);
  });
});

// PUT update a user
router.put('/:userid', (req, res, next) => {
  apimanager.updateUser(req.params.userid, req.body, (err, result) => {
    if (err) {
      console.error('Could not update user with id ' + req.params.userid + err);
    }
    
    console.log('User updated');
    res.status(201).send('Updated ' + result.changedRows + ' rows');
  });
});

// DELETE a user
router.delete('/:userid', (req, res, next) => {
  apimanager.deleteUser(req.params.userid, (err, result) => {
    if (err) {
      console.error('Error deleting user with id ' + req.params.id);
    }
  
    res.status(200).send('Deleted ' + result.affectedRows + ' rows');
  });
});

module.exports = router;

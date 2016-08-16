var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');
var apiMailgun = require('../services/mailgun');

// GET all users
router.get('/', (req, res, next) => {
  apiManager.hasAdministratorAccess(JSON.stringify(req.user[0].user_id), (err, admin) => {
    if (err) {
      console.error(`Error determining user access ${err}`);
    }
    if (!admin) {
      console.log('Access denied');
      res.status(401).send('Access denied');
    }
    
    console.log(`Logged-in with user id ${JSON.stringify(req.user[0].user_id)}`);
    apiManager.allUsers((err, result) => {
      if (err) {
        console.error(`Error getting all users ${err}`);
      }
    
      res.status(200).send(result);
    });
  });
});

// GET user role
router.get('/:userid/role', (req, res, next) => {
  apiManager.hasAdministratorAccess(req.params.userid, (err, result) => {
    if (err) {
      console.error(`Error determining user access ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET user by userid
router.get('/:userid', (req, res, next) => {
  apiManager.hasAdministratorAccess(JSON.stringify(req.user[0].user_id), (err, admin) => {
    if (err) {
      console.error(`Error determining user access ${err}`);
    }
    if (!admin) {
      console.log('Access denied');
      res.status(401).send('Access denied');
    }
    
    apiManager.getUser(req.params.userid, (err, result) => {
      if (err) {
        console.error('No user for the given id ' + req.params.userid + err);
      }
    
      res.status(200).send(result);
    });
  });
});

// POST create a new user
router.post('/', (req, res, next) => {
  apiManager.hasAdministratorAccess(JSON.stringify(req.user[0].user_id), (err, admin) => {
    if (err) {
      console.error(`Error determining user access ${err}`);
    }
    if (!admin) {
      console.log('Access denied');
      res.status(401).send('Access denied');
    }
    
    apiManager.createUser(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
      if (err) {
        console.error('Error creating a new user' + err);
      }
    
      console.log('User inserted with id ' + result.insertId);
    
      // Get created user details for sending email
      apiManager.getUser(result.insertId, (err, user) => {
        if (err) {
          console.error('No user for the given id ' + result.insertId + err);
        }
      
        // Construct email data object
        var data = {
          from: 'Admin <admin@cassyapp.com>',
          to: 'anup.kher.1990@gmail.com',
          subject: 'Hello from Cassy',
          text: `You have been entered into the system. Your default password is ${user[0].password}`
        };
    
        // Send email with default password
        apiMailgun.sendMail(data, (err, body) => {
          if (err) {
            console.error('There was an error sending the email: ' + err);
          }
      
        });
    
      });
    
      res.status(201).send(result);
    });
  });
});

// PUT update a user
router.put('/:userid', (req, res, next) => {
  apiManager.hasAdministratorAccess(JSON.stringify(req.user[0].user_id), (err, admin) => {
    if (err) {
      console.error(`Error determining user access ${err}`);
    }
    if (!admin) {
      console.log('Access denied');
      res.status(401).send('Access denied');
    }
    
    apiManager.updateUser(JSON.stringify(req.user[0].user_id), req.params.userid, req.body, (err, result) => {
      if (err) {
        console.error('Could not update user with id ' + req.params.userid + err);
      }
    
      console.log('User updated');
      res.status(201).send('Updated ' + result.changedRows + ' rows');
    });
  });
});

// PUT change user password
router.put('/:userid/change-password', (req, res, next) => {
  apiManager.hasAdministratorAccess(JSON.stringify(req.user[0].user_id), (err, admin) => {
    if (err) {
      console.error(`Error determining user access ${err}`);
    }
    if (!admin) {
      console.log('Access denied');
      res.status(401).send('Access denied');
    }
    
    apiManager.changePassword(JSON.stringify(req.user[0].user_id), req.params.userid, req.body, (err, result) => {
      if (err) {
        console.error('Error changing user\'s password ' + req.params.userid + err);
      }
    
      console.log('Password updated');
      res.status(200).send('Updated ' + result.changedRows + ' rows');
    });
  });
});

// DELETE a user
router.delete('/:userid', (req, res, next) => {
  apiManager.hasAdministratorAccess(JSON.stringify(req.user[0].user_id), (err, admin) => {
    if (err) {
      console.error(`Error determining user access ${err}`);
    }
    if (!admin) {
      console.log('Access denied');
      res.status(401).send('Access denied');
    }
    
    apiManager.deleteUser(JSON.stringify(req.user[0].user_id), req.params.userid, (err, result) => {
      if (err) {
        console.error('Error deleting user with id ' + req.params.id);
      }
  
      res.status(200).send('Deleted ' + result.affectedRows + ' rows');
    });
  });
});

module.exports = router;

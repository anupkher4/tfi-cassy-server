var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

// POST forgot password
router.post('/', (req, res, next) => {
  apiManager.forgotPassword(req.body, (err, result) => {
    if (err) {
      console.error(`Invalid username ${req.body}`);
    }
    
    res.status(200).send(result);
  });
});

module.exports = router;
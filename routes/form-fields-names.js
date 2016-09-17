var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

// GET all form fields
router.get('/', (req, res, next) => {
  apiManager.getAllFormFieldNames((err, result) => {
    if (err) {
      console.error(`Error getting form fields ${err}`);
    }
    
    res.status(200).send(result);
  });
});



// GET a field by id
router.get('/:fieldnameid', (req, res, next) => {
  apiManager.getFormFieldNamebyid(req.params.fieldid, (err, result) => {
    if (err) {
      console.error(`Error getting form field id ${req.params.fieldid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

/*
// GET a field by name
router.get('/:fieldname', (req, res, next) => {
  apiManager.getFormFieldByName(req.params.fieldname, (err, result) => {
    if (err) {
      console.error(`Error getting form field ${req.params.fieldname}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});
*/

module.exports = router;
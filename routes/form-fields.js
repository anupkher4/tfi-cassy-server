var express = require('express');
var router = express.Router();
var apiManager = require('../services/api-manager');

// GET all form fields
router.get('/', (req, res, next) => {
  apiManager.getAllFormFields((err, result) => {
    if (err) {
      console.error(`Error getting form fields ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET all form field names
router.get('/names', (req, res, next) => {
  apiManager.getAllFormFieldNames((err, result) => {
    if (err) {
      console.error(`Error getting form field names ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a field by id
router.get('/:fieldid', (req, res, next) => {
  apiManager.getFormField(req.params.fieldid, (err, result) => {
    if (err) {
      console.error(`Error getting form field id ${req.params.fieldid}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// GET a field by name
router.get('/:fieldname', (req, res, next) => {
  apiManager.getFormFieldByName(req.params.fieldname, (err, result) => {
    if (err) {
      console.error(`Error getting form field ${req.params.fieldname}, Error ${err}`);
    }
    
    res.status(200).send(result);
  });
});

// POST create a form field
router.post('/', (req, res, next) => {
  apiManager.createFormField(JSON.stringify(req.user[0].user_id), req.body, (err, result) => {
    if (err) {
      console.error(`Could not create form field ${err}`);
    }
    
    console.log(`Created form field with id ${result.insertId}`);
    res.status(201).send(result);
  });
});

// PUT update a form field
router.put('/:fieldid', (req, res, next) => {
  apiManager.updateFormField(JSON.stringify(req.user[0].user_id), req.params.fieldid, (err, result) => {
    if (err) {
      console.error(`Error updating form field id ${req.params.fieldid}, Error ${err}`);
    }
    
    console.log('Form field updated');
    res.status(200).send(`Updated ${result.changedRows} rows`);
  });
});

// DELETE a form field
router.delete('/:fieldid', (req, res, next) => {
  apiManager.deleteFormField(JSON.stringify(req.user[0].user_id), req.params.fieldid, (err, result) => {
    if (err) {
      console.error(`Error deleting form field ${req.params.fieldid}`);
    }
    
    console.log('Field deleted');
    res.status(200).send(`Deleted ${result.affectedRows} rows`);
  });
});

module.exports = router;
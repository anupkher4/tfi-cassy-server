var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cassy-server', description: 'This site is under construction' });
});

module.exports = router;

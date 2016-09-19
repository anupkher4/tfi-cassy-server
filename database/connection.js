var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '138.68.51.129',
  port: 3306,
  user: 'appuser',
  password: 'APP_pass1',
  database: 'cassydev'
});

module.exports = connection;


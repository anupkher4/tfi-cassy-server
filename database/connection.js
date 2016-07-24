var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'cassy-mysql-instance1.c49puvquqrxu.us-east-1.rds.amazonaws.com',
  port: 3306,
  user: 'awsadminuser',
  password: 'tficassy',
  database: 'cassydev'
});

module.exports = connection;


var apiKey = 'key-04c3b9d1b5d6462eb0bbff844e6880b0';
var domain = 'cassyapp.com';
var mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});

var apiMailgun = {};

// Send email with data
apiMailgun.sendMail = (emailData, callback) => {
  mailgun.messages().send(emailData, (err, body) => {
    if (err) {
      callback(err);
    }
    callback(null, body);
  });
};

module.exports = apiMailgun;
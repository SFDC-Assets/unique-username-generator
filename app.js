var express = require('express');
var bodyParser = require('body-parser');

var memjs = require('memjs')
var mc = memjs.Client.create()

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to generate a random 9-character string
function generateRandomString(length = 9) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// catch 404 and forward to error handler
app.post('/unique', (req, res) => {
  const prefix = req.body.prefix;
  const domain = req.body.domain;
  mc.increment(`${prefix}/${domain}`, 1, {}, function (err,success, value) {
    if (err) {
      res.status(400).send(err);
      console.log("Error setting key: " + err);
    } else {
      // Generate the 9-character random string
      const randomStr = generateRandomString();

      // Prepend it to the incremented value
      const finalValue = `${randomStr}${value}`;

      res.json({ message: `${prefix}${finalValue}@${domain}` });
    }
  });

});

module.exports = app;
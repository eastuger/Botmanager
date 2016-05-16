var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
// respond with "hello world" when a GET request is made to the homepage
app.get('/hello', function(req, res){
  res.send('world!');
});

app.get('/', function(req, res) {
  res.send('hello world');
});

app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'super-secret') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})


app.post('/webhook/', function (req, res) {
  var textArray = [
    'Ok ok ok',
    'Hier is geen speeltuin vriend',
    'Droevig dit',
    'Pottenbakker!',
    'Jalala lala la lala',
    'Hou op',
    'Stop hiermee',
    'Ik daan em'
  ]
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
   event = req.body.entry[0].messaging[i];
   sender = event.sender.id;
   if (event.message && event.message.text) {
     text = event.message.text;
     console.log(textArray[Math.floor(Math.random() * textArray.length)]);
     sendTextMessage(sender, textArray[Math.floor(Math.random() * textArray.length)]);
   }
 }
 res.sendStatus(200);
})

var token = "EAADDyg2Xz3QBAHFMgW8PzxsZBlNFdoK5NrWqeeWLVnocKLojj0KkskrGzVimZCQ3f2iuTvG5ZCNCcxg4RAzOKoOuo5rHEZCfXuuIHfaj5wPeBMiFe51x39fDpeb9SvRZCZCjkf58OeITeNFwOZAK2VRSnJZBZBZBInGX0iDd6Wjeb1zwZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.listen(process.env.PORT || 3000);

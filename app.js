var express = require('express');
var app = express();

app.set('config', require('./config'));

var hotlinebox = require('./routes/front/hotlinebox');
var switchonline = require('./routes/back/switchonline');

app.use('/hotline-box', hotlinebox);
app.use('/switch-online', switchonline);

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
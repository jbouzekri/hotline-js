var express = require('express');
var app = express();

var environment = process.env.NODE_ENV || "dev";

var config = require('./config')(environment);
app.set('config', config);

var logger = require('./logger')(config);

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

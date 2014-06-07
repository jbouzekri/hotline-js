var express      = require('express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var csrf         = require('csurf');
var validator    = require('express-validator');

var app = express();

// Load env variable
var environment = process.env.NODE_ENV || "dev";

// Load nconf configuration
var config = require('./config')(environment);
app.set('config', config);

// static file folder
app.use(express.static(__dirname + '/public'));

// Enable jade
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Body parser for form post and csrf token management
app.use(bodyParser());
app.use(validator());
app.use(cookieParser()); // required before session.
app.use(session({
    secret: config.get('session').secret
  //, proxy: true // if you do SSL outside of node.
}));
app.use(csrf());

// Load winston logger
var logger = require('./logger')(config);

// Routes
var chatbox = require('./routes/front/chatbox');
var statusbox = require('./routes/front/statusbox');
var contact = require('./routes/front/contact');
var switchonline = require('./routes/back/switchonline');
var crosres = require('./cros.js')(config);

app.use('/front', crosres);
app.use('/front/status-box', statusbox);
app.use('/front/chat-box', chatbox);
app.use('/front/contact', contact);
app.use('/switch-online', switchonline);

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

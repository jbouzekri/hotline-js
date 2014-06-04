var express      = require('express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var csrf         = require('csurf');

var app = express();

// Load env variable
var environment = process.env.NODE_ENV || "dev";

// Load nconf configuration
var config = require('./config')(environment);
app.set('config', config);

// Enable jade
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Body parser for form post and csrf token management
app.use(cookieParser()); // required before session.
app.use(session({
    secret: config.get('session').secret
  //, proxy: true // if you do SSL outside of node.
}));
app.use(bodyParser());
app.use(csrf());

// Load winston logger
var logger = require('./logger')(config);

// static file folder
app.use(express.static(__dirname + '/public'));

// Routes
var hotlinebox = require('./routes/front/hotlinebox');
var contact = require('./routes/front/contact');
var switchonline = require('./routes/back/switchonline');
var crosres = require('./cros.js')(config);

app.use('/front', crosres);
app.use('/front/hotline-box', hotlinebox);
app.use('/switch-online', switchonline);

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

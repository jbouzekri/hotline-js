var express      = require('express');
var cookieParser = require('cookie-parser')();
var session      = require('express-session');
var bodyParser   = require('body-parser');
var csrf         = require('csurf');
var validator    = require('express-validator');
var passport     = require('passport');
var connect      = require('connect');
var uid          = require('uid2');
var flash        = require('connect-flash');

var sessionStore = new connect.middleware.session.MemoryStore();

var app            = express();

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
app.locals.theme = config.get('theme');

// Configure passport and return a function used to secure routes
var ensureAuthenticated = require('./lib/security/passport')(config);

// Body parser for form post and csrf token management
app.use(bodyParser());
app.use(validator());
app.use(cookieParser); // required before session.
app.use(session({
    secret: config.get('session').secret,
    store: sessionStore,
    cookie: { maxAge: 3600000 }
  //, proxy: true // if you do SSL outside of node.
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());
app.use(function(req, res, next) {
    // Store a custom id in its session to identify user without its session id
    var sess = req.session;
    if (typeof sess.customerId == "undefined") {
        sess.customerId = uid(24);
        console.log('Session customer id #'+sess.customerId+' generated');
    }
    next();
});

// Load winston logger
var logger = require('./logger')(config);

// Add online state object to app
app.set('online_state', require('./online_state'));

// Routes Front
var chatbox = require('./lib/routes/front/chatbox');
var statusbox = require('./lib/routes/front/statusbox');
var contact = require('./lib/routes/front/contact');
var crosres = require('./cros.js')(config);

app.use('/front', crosres);
app.use('/front/status-box', statusbox);
app.use('/front/chat-box', chatbox);
app.use('/front/contact', contact);

// Routes back
var desktop = require('./lib/routes/back/desktop');
var login = require('./lib/routes/back/login');

app.use('/admin/login', login);
app.use('/admin', ensureAuthenticated);
app.use('/admin', desktop);


app.use(function(err, req, res, next){
  console.log(req);
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

// Load socket io event and bind to port
var server = require('./socket').listen(app, sessionStore, config.get('port'), function(){
    console.log('Listening on port %d', server.address().port);
});

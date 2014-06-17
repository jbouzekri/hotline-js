var express      = require('express');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var csrf         = require('csurf');
var validator    = require('express-validator');
var passport     = require('passport');
var flash        = require('connect-flash');
var onlineState  = require('./online_state.js');

var app  = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

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
var ensureAuthenticated = require('./config_passport')(config);

// Body parser for form post and csrf token management
app.use(bodyParser());
app.use(validator());
app.use(cookieParser()); // required before session.
app.use(session({
    secret: config.get('session').secret
  //, proxy: true // if you do SSL outside of node.
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());

// Load winston logger
var logger = require('./logger')(config);

// Routes Front
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

// Routes back
var desktop = require('./routes/back/desktop');
var login = require('./routes/back/login');

app.use('/admin/login', login);
app.use('/admin', ensureAuthenticated);
app.use('/admin', desktop);


app.use(function(err, req, res, next){
  console.log(req);
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

io.on('connection', function(socket){
  socket.on('online-toggle', function(msg){
      var online = onlineState.toggleState().online;
      socket.emit('online-state', onlineState);
  });
});

var server = http.listen(3000, function(){
    console.log('Listening on port %d', server.address().port);
});

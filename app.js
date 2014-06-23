var express      = require('express');
var cookieParser = require('cookie-parser')();
var session      = require('express-session');
var bodyParser   = require('body-parser');
var csrf         = require('csurf');
var validator    = require('express-validator');
var passport     = require('passport');
var connect      = require('connect');
var flash        = require('connect-flash');
var onlineState  = require('./online_state.js');
var uid          = require('uid2');
var operator     = require('./operator.js');
var sessionStore = new connect.middleware.session.MemoryStore();

var app            = express();
var http           = require('http').Server(app);
var io             = require('socket.io')(http);
var SessionSockets = require('session.socket.io-express4');
sessionSockets     = new SessionSockets(io, sessionStore, cookieParser);

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

sessionSockets.on('connection', function (err, socket, session) {

    console.log('[socket #'+socket.id+'] connected');

    // Store a custom id to identify user without its session id in its session
    if (typeof session != "undefined"
          && typeof session.customerId == "undefined") {
      session.customerId = uid(24);
      console.log('[socket #'+socket.id+'] Session customer id #'+session.customerId+' generated');
    }


    // Operators join all the same room to receive all message
    if (operator.isOperator(session)) {
        console.log('[socket #'+socket.id+'] Operator detected');
        socket.join('operators');
        operator.registerOperator(socket, session);
    } else {
        console.log('[socket #'+socket.id+'] User detected');
          // Register user socket for future reference
        operator.registerUser(socket, session);
    }

    socket.on('chat-state', function(msg) {
        console.log('[socket #'+socket.id+'] chat-state message received');
        socket.emit('chat-state', operator.buildStateMessage());
        console.log('[socket #'+socket.id+'] chat-state message sent');
    });

    socket.on('online-toggle', function(msg){
        console.log('[socket #'+socket.id+'] online-toggle message received');
        if (operator.isOperator(session)) {
            var online = onlineState.toggleState().online;
        }
        socket.emit('online-state', onlineState);
        console.log('[socket #'+socket.id+'] online-toggle message sent');
    });

    socket.on('chat-message', function(msg) {
        if (operator.validateMessage(msg)) {
          io.to('operators').emit('chat-message', operator.buildMessage(session, msg));
        }
    });

    socket.on('answer-message', function(msg) {
        var answerSocket = operator.findUserSocket(msg.customerId);
        answerSocket.emit('answer-message', msg);
    });

    socket.on('disconnect', function(){
        operator.deleteSocket(socket);
    });
});

var server = http.listen(3000, function(){
    console.log('Listening on port %d', server.address().port);
});

var cookieParser = require('cookie-parser')();
var manager      = require('./manager.js');
var uid          = require('uid2');
var SessionSockets = require('session.socket.io-express4');

module.exports.listen = function(app, sessionStore, port, callback) {

    var http           = require('http').Server(app);
    var io             = require('socket.io')(http);
    sessionSockets     = new SessionSockets(io, sessionStore, cookieParser);

    sessionSockets.on('connection', function (error, socket, session) {
        if (error) {
            // TODO : error handling
            return;
        }

        console.log('[socket #'+socket.id+'] connected');

        // Store a custom id to identify user without its session id in its session
        if (typeof session != "undefined"
              && typeof session.customerId == "undefined") {
          session.customerId = uid(24);
          console.log('[socket #'+socket.id+'] Session customer id #'+session.customerId+' generated');
        }


        // Operators join all the same room to receive all message
        if (manager.isOperator(session)) {
            console.log('[socket #'+socket.id+'] Operator detected');
            socket.join('managers');
            manager.registerOperator(socket, session);
        } else {
            console.log('[socket #'+socket.id+'] User detected');
              // Register user socket for future reference
            manager.registerUser(socket, session);
        }

        socket.on('chat-state', function(msg) {
            console.log('[socket #'+socket.id+'] chat-state message received');
            socket.emit('chat-state', manager.buildStateMessage());
            console.log('[socket #'+socket.id+'] chat-state message sent');
        });

        socket.on('online-toggle', function(msg){
            console.log('[socket #'+socket.id+'] online-toggle message received');
            if (manager.isOperator(session)) {
                var online = onlineState.toggleState().online;
            }
            socket.emit('online-state', onlineState);
            console.log('[socket #'+socket.id+'] online-toggle message sent');
        });

        socket.on('user-message', function(msg) {
            if (manager.validateMessage(msg)) {
              io.to('managers').emit('user-message', manager.buildMessage(session, msg));
            }
        });

        socket.on('manager-message', function(msg) {
            var answerSocket = manager.findUserSocket(msg.customerId);
            if (answerSocket) {
                answerSocket.emit('manager-message', msg.msg);
            }
        });

        socket.on('disconnect', function(){
            manager.deleteSocket(socket);
        });
    });

    return http.listen(port, callback);
}
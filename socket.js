var cookieParser   = require('cookie-parser')();
var manager        = require('./manager.js');
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

        if (typeof session != "undefined"
                && typeof session.customerId != "undefined") {
            console.log('[socket #'+socket.id+'] Use customerId '+session.customerId);
        }

        // Operators join all the same room to receive all message
        if (manager.isOperator(session)) {
            console.log('[socket #'+socket.id+'] Operator detected');
            socket.join('managers');
            manager.registerOperatorSocket(socket, session);
        } else {
            console.log('[socket #'+socket.id+'] User detected');
              // Register user socket for future reference
            manager.registerUserSocket(socket, session);
        }

        socket.on('chat-state', function(msg) {
            console.log('[socket #'+socket.id+'] chat-state message received');
            socket.emit('chat-state', manager.buildStateMessage());
            console.log('[socket #'+socket.id+'] chat-state message sent');
        });

        socket.on('online-toggle', function(msg){
            console.log('[socket #'+socket.id+'] online-toggle message received');
            if (manager.isOperator(session)) {
                var online = app.get('online_state').toggleState().online;
            }
            socket.emit('online-state', app.get('online_state'));
            console.log('[socket #'+socket.id+'] online-toggle message sent');
        });

        socket.on('user-message', function(msg) {
            if (manager.validateMessage(msg)) {
              io.to('managers').emit('user-message', manager.buildUserMessage(session, msg));
            }
        });

        socket.on('operator-message', function(msg) {
            var answerSocket = manager.findUserSockets(msg.customerId);
            for (id in answerSocket) {
                answerSocket[id].emit('operator-message', manager.buildOperatorMessage(session, msg));
            }
            io.to('managers').emit('operator-message', msg);
        });

        socket.on('disconnect', function(){
            console.log('[socket #'+socket.id+'] disconnected');
            manager.deleteSocket(socket, session);
            io.to('managers').emit('chat-state', manager.buildStateMessage());
        });
    });

    return http.listen(port, callback);
}
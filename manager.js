var userSockets = [];
var operatorSockets = [];

module.exports.buildStateMessage = function() {
    var customerIds = [];
    var stateMessage = [];

    for (i in userSockets) {
        if (customerIds.indexOf(userSockets[i].customerId) === -1) {
            stateMessage.push({
                socketId: i,
                customerId: userSockets[i].customerId
            });

            customerIds.push(userSockets[i].customerId);
        }
    }

    return stateMessage;
}

module.exports.findUserSocket = function(customerId) {
    for (i in userSockets) {
        if (userSockets[i].customerId == customerId) {
            return userSockets[i];
        }
    }

    return false;
}

module.exports.deleteSocket = function(socket) {
    var i = userSockets.indexOf(socket);
    if (i !== -1) {
        delete userSockets[i];
    }
    var j = operatorSockets.indexOf(socket);
    if (j !== -1) {
        delete operatorSockets[i];
    }
}

module.exports.registerUser = function(socket, session) {
    socket.customerId = session.customerId;
    userSockets[socket.id] = socket;
};

module.exports.registerOperator = function(socket, session) {
    socket.customerId = session.customerId;
    operatorSockets[socket.id] = socket;
};

module.exports.isOperator = function(session) {
    if (typeof session !== "undefined"
        && typeof session.passport !== "undefined"
        && typeof session.passport.user !== "undefined") {
      return true;
  }

  return false;
};

module.exports.buildMessage = function(session, msg) {
    msg.customerId = session.customerId;
    msg.date = new Date();

    return msg;
};

module.exports.validateMessage = function(msg) {
    if (typeof msg.msg === "undefined") {
        return false;
    }

    if (typeof msg.pseudo === "undefined") {
        return false;
    }

    if (typeof msg.url === "undefined") {
        return false;
    }

    return true;
}
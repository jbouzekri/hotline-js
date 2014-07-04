var userSockets = [];
var operatorSockets = [];

module.exports.buildStateMessage = function() {
    var customerIds = [];
    var stateMessage = [];

    for (customerId in userSockets) {
        if (customerIds.indexOf(customerId) === -1) {
            stateMessage.push({
                customerId: customerId
            });

            customerIds.push(customerId);
        }
    }

    return stateMessage;
}

module.exports.findUserSockets = function(customerId) {
    if (typeof userSockets[customerId] !== "undefined") {
        return userSockets[customerId];
    }

    return false;
}

module.exports.deleteSocket = function(socket, session) {
    if (typeof userSockets[session.customerId] !== "undefined") {
        delete userSockets[session.customerId][socket.id];
        if (userSockets[session.customerId].length === 0) {
            delete userSockets[session.customerId];
        }
    }
    if (typeof operatorSockets[session.customerId] !== "undefined") {
        delete operatorSockets[session.customerId][socket.id];
        if (operatorSockets[session.customerId].length === 0) {
            delete operatorSockets[session.customerId];
        }
    }
}

module.exports.registerUserSocket = function(socket, session) {
    if (typeof userSockets[session.customerId] == "undefined") {
        userSockets[session.customerId] = [];
    }
    userSockets[session.customerId][socket.id] = socket;
};

module.exports.registerOperatorSocket = function(socket, session) {
    if (typeof operatorSockets[session.customerId] == "undefined") {
        operatorSockets[session.customerId] = [];
    }
    operatorSockets[session.customerId][socket.id] = socket;
};

module.exports.isOperator = function(session) {
    if (typeof session !== "undefined"
        && typeof session.passport !== "undefined"
        && typeof session.passport.user !== "undefined") {
      return true;
  }

  return false;
};

module.exports.buildUserMessage = function(session, msg) {
    msg.customerId = session.customerId;
    msg.date = new Date();

    return msg;
};

module.exports.buildOperatorMessage = function(session, msg) {
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
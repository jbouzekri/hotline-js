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

    return true;
}
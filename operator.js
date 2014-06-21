

module.exports.isOperator = function(session) {
    if (typeof session !== "undefined"
        && typeof session.passport !== "undefined"
        && typeof session.passport.user !== "undefined") {
      return true;
  }

  return false;
};

module.exports.buildMessage = function(session, msg) {
    var message = {
        customerId: session.customerId,
        msg: msg,
        date: new Date()
    };

    return message;
};
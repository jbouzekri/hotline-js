
var LocalProvider = module.exports = function LocalProvider(options) {
    this.users = options.users;

    this.findById = function (id, fn) {
        var idx = id - 1;
        if (this.users[idx]) {
            fn(null, this.users[idx]);
        } else {
            fn(new Error('User ' + id + ' does not exist'));
        }
    };

    this.findByUsername = function (username, fn) {
        for (var i = 0, len = this.users.length; i < len; i++) {
            var user = this.users[i];
            if (user.username === username) {
                return fn(null, user);
            }
        }
        return fn(null, null);
    };
};

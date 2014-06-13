var online = {
    online: false,
    startDate: null,

    toggleState: function() {
        this.online = !this.online;
        if (this.online) {
            this.startDate = new Date();
        }
    }
};

module.exports = online;
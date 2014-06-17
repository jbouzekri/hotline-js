var online = {
    online: false,
    startDate: null,
    html: '',

    toggleState: function() {
        this.online = !this.online;
        if (this.online) {
            this.startDate = new Date();
        }
        return this.online;
    }
};

module.exports = online;
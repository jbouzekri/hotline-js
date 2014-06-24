(function(window, document, $){
    var chatManager = {
        socket: null,
        pseudo: "undefined",
        cookieName: "hotlinejs",

        send: function(msg) {
            this.getSocket().emit('user-message', this.buildMessage(msg));
        },

        getSocket: function() {
            if (!this.socket) {
                this.socket = this.initSocket();
            }

           return this.socket;
        },

        initSocket: function() {
            newSocket = io({reconnectionAttempts: 5});
            newSocket.on('operator-message', function(msg){
                $('#chat-items ul').append('<li>'+msg+'</li>')
            });
            return newSocket;
        },

        setPseudo: function(pseudo) {
            this.pseudo = pseudo;

            return this;
        },

        reloadPseudo: function() {
            $('#current-pseudo').html(this.pseudo);
            this.reloadCookie();
        },

        reloadCookie: function() {
            var cookieValue = "pseudo;"+this.pseudo;
            document.cookie = this.cookieName + "=" + cookieValue;
        },

        buildMessage: function(msg) {
            return {
                msg: msg,
                pseudo: this.pseudo,
                date: new Date(),
                url: window.location.href
            };
        }
    }

    $('#pseudo-link').click(function(event){
        event.preventDefault();
        $('#chat-container').hide();
        $('#pseudo-form').show();
    });

    $('#pseudo-form form').submit(function(event){
        event.preventDefault();
        var pseudo = $(this).find('input').val();
        chatManager
            .setPseudo(pseudo)
            .reloadPseudo();
        $('#pseudo-form').hide();
        $('#chat-container').show();
    });

    $('#chat-form').submit(function(event){
        event.preventDefault();
        var message = $(this).find('textarea').val()
        chatManager.send(message);
    });

})(window, document, jQuery);
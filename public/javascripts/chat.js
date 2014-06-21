(function(window, document, $){
    var chatManager = {
        socket: null,
        pseudo: "undefined",
        cookieName: "hotlinejs",

        send: function(msg) {
            this.getSocket().emit('chat-message', msg);
        },

        getSocket: function() {
            if (!this.socket) {
                this.socket = this.initSocket();
            }

           return this.socket;
        },

        initSocket: function() {
            newSocket = io();
            newSocket.on('chat-message', function(msg){
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
        event.preventDefault()
        chatManager.send($(this).find('textarea').val());
    });

})(window, document, jQuery);
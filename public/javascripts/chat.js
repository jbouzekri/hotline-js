(function(window, document, $){
    var chatManager = {
        socket: null,

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
        }
    }


    $('#chat-form').submit(function(event){
        event.preventDefault()
        chatManager.send($(this).find('textarea').val());
    });

})(window, document, jQuery);
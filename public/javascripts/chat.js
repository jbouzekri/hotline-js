(function(window, document, $){
    var chatManager = {
        socket: null,
        pseudo: "undefined",
        cookieName: "hotlinejs",

        send: function(msg) {
            var message = this.buildMessage(msg);
            this.getSocket().emit('user-message', message);
            this.addMessage(message);
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
                chatManager.addMessage(msg, 'operator');
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
        },

        addMessage: function (msg, classMessage) {
            classMessage = classMessage || '';

            var date = new Date(msg.date);
            var formatedDate =
                date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()
                +' '+date.getHours()+':'+date.getMinutes();

            $('#chat-items ul').append(
                '<li class="'+classMessage+'"><span class="date">'+formatedDate+'</span>'+this.encodeHTML(msg.msg)+'</li>'
            );

            var scrollTo_val = $('#chat-items').prop('scrollHeight') + 'px';
            $('#chat-items').slimScroll({ scrollTo: scrollTo_val });
        },

        encodeHTML: function (s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        }
    }

    /* TODO : pseudo management
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
    });*/

    $('#chat-form').submit(function(event){
        event.preventDefault();
        var textarea = $(this).find('textarea');
        var message = textarea.val()
        chatManager.send(message);
        textarea.val('');
    });

})(window, document, jQuery);
(function(window, document, $){

    var jwm = {
        template: ' \
<div class="window panel panel-default unread"> \
  <div class="panel-heading">Panel heading without title</div> \
  <div class="panel-body"> \
    <ul></ul>\n\
    <textarea class="answer-text"></textarea>\n\
    <button class="answer-button">Send</button> \
  </div> \
</div>',

        createWindow: function (customerId) {
            var jWin = $(this.template);
            jWin.attr('id', 'window-'+customerId);
            jWin.data('customerId', customerId);
            jWin.resizable();
            jWin.draggable();
            $('body').append(jWin);

            return jWin;
        },

        addOrUpdateWindow: function(customerId) {
            var $customerWin = $('#window-'+customerId);
            if ($customerWin.length > 0) {
                $customerWin.addClass('unread');
            } else {
                $customerWin = this.createWindow(customerId);
            }

            return $customerWin;
        },

        addMessage: function ($customerWin, msg) {
            $customerWin.find('.panel-body ul').append('<li>'+this.encodeHTML(msg)+'</li>');
        },

        encodeHTML: function (s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        }
    };

    var DesktopManager = {
        userTabParent: $('#users ul'),

        addUser: function(customerId, pseudo) {
            var pseudo = pseudo || "undefined";
            var $customerTab = $('#tab-'+customerId);
            if ($customerTab.length === 0) {
                this.userTabParent.append('<li id="tab-'+customerId+'" class="unread">undefined</li>');
            }
        },

        updateUnreadState: function(customerId) {
            var $customerTab = $('#tab-'+customerId);
            $customerTab.addClass('unread');
        },

        updateUsers: function (data) {
            var customerIds = [];
            for (id in data) {
                var customerId = data[id].customerId;
                this.addUser(customerId);
                customerIds.push(customerId);
            }
            this.userTabParent.find('li').each(function(index){
                var customerId = $(this).attr('id').slice(4);
                if (customerIds.indexOf(customerId) === -1) {
                    $(this).remove();
                }
            });
        }
    };

    $('#create-window').click(function(){
        jwm.createWindow();
    });

    var socket = io({reconnectionAttempts: 5});

    socket.on('connect', function () {
        socket.emit('chat-state', {});
    });

    socket.on('chat-state', function (chatState) {
        DesktopManager.updateUsers(chatState);
        console.log(chatState);
    });

    socket.on('online-state', function(onlineState){
        $('#toggle-online .state').hide();
        var stateClass = (onlineState.online) ? 'online-state' : 'offline-state';
        $('#toggle-online .'+stateClass).show();
    });

    socket.on('user-message', function(msg) {
        var customerId = msg.customerId;
        DesktopManager.addUser(customerId);
        DesktopManager.updateUnreadState(customerId);
        var $customerWin = jwm.addOrUpdateWindow(customerId);
        jwm.addMessage($customerWin, msg.msg);
    });

    $(document).on('click', '.answer-button', function(event) {
        event.preventDefault();
        var message = $(this).siblings('.answer-text').val();
        var customerId = $(this).parents('.window.panel').data('customerId');
        console.log({
            customerId: customerId,
            msg: message
        });
        socket.emit('operator-message', {
            customerId: customerId,
            msg: message
        })
    });

    $('#toggle-online').click(function(event){
        event.preventDefault();
        socket.emit('online-toggle', 'toggle');
    });

    $('#reload-state').click(function(event){
        socket.emit('chat-state', {});
    });
})(window, document, jQuery);
(function(window, document, $){

    var jwm = {
        template: ' \
<div class="window panel panel-default" style="display: none;"> \
  <div class="panel-heading">Panel heading without title</div> \
  <div class="panel-body"> \
    <ul></ul>\n\
    <textarea class="answer-text"></textarea>\n\
    <button class="answer-button">Send</button> \
  </div> \
</div>',

        createWindow: function (customerId) {
            // Append the window to the
            var jWin = $(this.template);
            jWin.attr('id', 'window-'+customerId);
            jWin.data('customerid', customerId);
            jWin.resizable();
            jWin.draggable({
                drag: function( event, ui ) {
                    if (!$(this).hasClass('selected')) {
                        jwm.selectWindow($(this));
                    }
                }
            });
            $('body').append(jWin);

            return jWin;
        },

        addOrUpdateWindow: function(customerId) {
            var $customerWin = $('#window-'+customerId);
            if ($customerWin.length === 0) {
                $customerWin = this.createWindow(customerId);
            }
            if (!$customerWin.hasClass('selected')) {
                $customerWin.addClass('unread');
            }

            return $customerWin;
        },

        selectWindow: function(windowObject) {
            var customerId = windowObject.data('customerid');

            // Set selected class on click window
            $('.window').removeClass('selected');
            windowObject.addClass('selected');
            windowObject.show();

            // Remove unread from window and tab
            windowObject.removeClass('unread');
            $('#tab-'+customerId).removeClass('unread');
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
                this.userTabParent.append('<li class="tab" id="tab-'+customerId+'" data-customerid="'+customerId+'" class="unread">undefined</li>');
            }

            var $customerWindow = $('#window-'+customerId);
            if ($customerWindow.length === 0) {
                jwm.createWindow(customerId);
            }
        },

        updateUnreadState: function(customerId) {
            var $customerWindow = $('#window-'+customerId);
            if (!$customerWindow.hasClass('selected')) {
                var $customerTab = $('#tab-'+customerId);
                $customerTab.addClass('unread');
            }
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
        var createdWindow = jwm.createWindow();
        // Select the newly created window to be over the others
        jwm.selectWindow(createdWindow);
    });

    var socket = io({reconnectionAttempts: 5});

    socket.on('connect', function () {
        socket.emit('chat-state', {});
    });

    socket.on('chat-state', function (chatState) {
        console.log(chatState);
        DesktopManager.updateUsers(chatState);
    });

    socket.on('online-state', function(onlineState){
        $('#toggle-online .state').hide();
        var stateClass = (onlineState.online) ? 'online-state' : 'offline-state';
        $('#toggle-online .'+stateClass).show();
    });

    socket.on('user-message', function(msg) {
        console.log(msg);
        var customerId = msg.customerId;
        DesktopManager.addUser(customerId);
        DesktopManager.updateUnreadState(customerId);
        var $customerWin = jwm.addOrUpdateWindow(customerId);
        jwm.addMessage($customerWin, msg.msg);
    });

    $(document).on('click', '.answer-button', function(event) {
        event.preventDefault();
        var message = $(this).siblings('.answer-text').val();
        var customerId = $(this).parents('.window.panel').data('customerid');
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

    $(document).on('click', '.window', function(event){
        event.stopPropagation();
        event.preventDefault();
        jwm.selectWindow($(this));
    });

    $(document).on('click', '.tab', function(event){
        var customerId = $(this).data('customerid');
        var customerWindow = $('#window-'+customerId);
        if (customerWindow.is(':visible')) {
            customerWindow.hide();
        } else {
            jwm.selectWindow($('#window-'+customerId));
        }
    });
})(window, document, jQuery);
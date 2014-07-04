(function(window, document, $){

    /**
     * Helper to display a message when debug is activated
     *
     * @param {object}|string message
     * @param string socketEvent
     *
     * @returns {undefined}
     */
    function debugHelper(message, socketEvent) {
        if (typeof socketEvent !== "undefined") {
            console.log(socketEvent+" received");
        }
        if (window.debug) {
            console.log(message);
        }
    }

    /**
     * Desktop JS Window Manager
     *
     * @type {jwm}
     */
    var jwm = {

        /**
         * Template to create a chat window
         *
         * @var {string}
         */
        template: ' \
<div class="window panel panel-default" style="display: none;"> \
  <div class="panel-heading">\n\
    <span class="pseudo">Undefined</span>\n\
    <div class="pull-right tools">\n\
        <a href="#minus" class="minus"><span class="glyphicon glyphicon-minus"></span></a>\n\
        <a href="#remove" class="remove"><span class="glyphicon glyphicon-remove"></span></a>\n\
    </div>\n\
  </div> \
  <div class="panel-body"> \
    <ul></ul>\n\
  </div> \n\
  <div class="form-box">\n\
    <div class="input-group">\n\
      <textarea class="form-control answer-text" rows="2"></textarea>\n\
      <span class="input-group-btn">\n\
        <button class="btn btn-default answer-button" type="button">Send</button>\n\
      </span>\n\
  </div></div>\
</div>',

        /**
         * Create an empty a window and append to body
         *
         * @param string customerId
         * @returns {$}
         */
        createWindow: function (customerId, pseudo) {
            var pseudo = pseudo || "Undefined";

            // Chat Window jquery object
            var jWin = $(this.template);
            jWin.attr('id', 'window-'+customerId);
            jWin.attr('data-customerid', customerId);
            this.updatePseudo(jWin, pseudo);
            // Resizable and draggable
            jWin.resizable({
                minHeight: 290,
                minWidth: 290
            });
            jWin.draggable({
                cursor: "crosshair",
                cancel: "input,textarea,button,select,option,.panel-body,form-box",
                // Hack to select the window which is dragged
                drag: function( event, ui ) {
                    if (!$(this).hasClass('selected')) {
                        jwm.selectWindow($(this));
                    }
                }
            });
            jWin.find('.minus').click(function(event){
                event.stopPropagation();
                event.preventDefault();
                var winCustomerId = $(this).parents('.window').data('customerid');
                jwm.unselectWindow($('#window-'+winCustomerId));
                DesktopManager.toggleTab($('#tab-'+winCustomerId));
            });
            jWin.find('.remove').click(function(event){
                event.stopPropagation();
                event.preventDefault();
                var winCustomerId = $(this).parents('.window').data('customerid');
                $('#window-'+winCustomerId).remove();
                $('#tab-'+winCustomerId).remove();
            });
            // Click event to select on click
            jWin.click(function(event){
                event.stopPropagation();
                event.preventDefault();
                jwm.selectWindow($(this));
            });
            jWin.find('.answer-button').click(function(event){
                var windowObject = $(this).parents('.window.panel');
                var textField = windowObject.find('.answer-text');
                var message = textField.val();
                var customerId = windowObject.data('customerid');
                textField.val('');
                socket.emit('operator-message', {
                    customerId: customerId,
                    msg: message
                });
            });
            // Append to DOM
            $('body').append(jWin);

            return jWin;
        },

        /**
         * Update the pseudo
         *
         * @param {$} windowObject
         * @param {string} pseudo
         *
         * @returns {undefined}
         */
        updatePseudo: function (windowObject, pseudo) {
            windowObject.find('.pseudo').html(pseudo);
        },

        /**
         * Find a window
         *
         * @param string customerId
         *
         * @returns {$}|false
         */
        findWindow: function(customerId) {
            var $customerWin = $('#window-'+customerId);
            if ($customerWin.length > 0) {
                return $customerWin;
            }

            return false;
        },

        /**
         * Toggle a window
         *
         * @param {$} windowObject
         * @returns {undefined}
         */
        toggleWindow: function(windowObject) {
            if (windowObject.is(':visible')) {
                jwm.unselectWindow(windowObject);
            } else {
                jwm.selectWindow(windowObject);
            }
        },

        /**
         * Unselect a window
         *
         * @param {$} windowObject
         * @returns {undefined}
         */
        unselectWindow: function (windowObject) {
            windowObject.hide();
            windowObject.removeClass('selected');
        },

        /**
         * Operation on window DOM when selecting
         *
         * @param {$} windowObject
         *
         * @returns {undefined}
         */
        selectWindow: function(windowObject) {
            var customerId = windowObject.data('customerid');

            // Set selected class on click window
            $('.window').removeClass('selected');
            windowObject.addClass('selected');

            // Remove unread from window and tab
            windowObject.removeClass('unread');
            $('#tab-'+customerId).removeClass('unread');

            // Show the selected window
            windowObject.show();
        },

        /**
         * Update unread state on window
         *
         * @param {$} windowObject
         *
         * @returns {undefined}
         */
        updateUnreadState: function(windowObject) {
            var customerId = windowObject.data('customerid');

            if (!windowObject.hasClass('selected')) {
                windowObject.addClass('unread');
            }
            if (!windowObject.hasClass('selected')) {
                var $customerTab = $('#tab-'+customerId);
                $customerTab.addClass('unread');
            }
        },

        /**
         * Add a message to a specific window
         *
         * @param {$} $customerWin
         * @param {string} msg
         *
         * @returns {undefined}
         */
        addMessage: function ($customerWin, msg, classMessage) {
            classMessage = classMessage || '';

            var date = new Date(msg.date);
            var formatedDate =
                date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()
                +' '+date.getHours()+':'+date.getMinutes();

            $customerWin.find('.panel-body ul').append(
                '<li class="'+classMessage+'"><span class="date">'+formatedDate+'</span>'+this.encodeHTML(msg.msg)+'</li>'
            );
        },

        /**
         * Tool to encode message coming from user
         *
         * @param {string} s
         *
         * @returns {string}
         */
        encodeHTML: function (s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
        }
    };

    /**
     * Desktop Manager
     *
     * @type {DesktopManager}
     */
    var DesktopManager = {

        /**
         * DOM object printing chat tabs
         *
         * @var {$}
         */
        userTabParent: $('#user-tabs ul'),

        /**
         * Add a chat user to the desktop
         *
         * @param {string} customerId
         * @param {string} pseudo
         *
         * @returns {undefined}
         */
        addUser: function(customerId, pseudo) {
            var pseudo = pseudo || "Undefined";

            // The tab does not exist. Add one.
            var $customerTab = $('#tab-'+customerId);
            if ($customerTab.length === 0) {
                this.userTabParent.append('<li class="tab unread" id="tab-'+customerId+'" data-customerid="'+customerId+'">'+pseudo+'</li>');
            }

            // The window does not exist. Add one.
            var $customerWindow = $('#window-'+customerId);
            if ($customerWindow.length === 0) {
                $customerWindow = jwm.createWindow(customerId, pseudo);
            }
        },

        /**
         * Update unread state on tab
         *
         * @param {string} customerId
         * @param {$} windowObject
         *
         * @returns {undefined}
         */
        updateUnreadState: function(customerId, windowObject) {
            if (!windowObject.hasClass('selected')) {
                var $customerTab = $('#tab-'+customerId);
                $customerTab.addClass('unread');
            }
        },

        /**
         * Update user in tab
         *
         * @param array data
         *
         * @returns {undefined}
         */
        updateTabs: function (data) {
            // Store found customerIds in data
            var customerIds = [];

            // For each data object. Create a tab or update an existing tab.
            for (id in data) {
                var customerId = data[id].customerId;
                this.addUser(customerId);
                customerIds.push(customerId);
            }

            // Parse all existing tab and removed the one (with its window) where the customerId was not in the data array
            this.userTabParent.find('li').each(function(index){
                var customerId = $(this).attr('id').slice(4);
                if (customerIds.indexOf(customerId) === -1) {
                    $(this).remove();
                    $('#window-'+customerId).remove();
                }
            });
        },

        /**
         * Toggle a tab
         *
         * @param {$} tabObject
         * @returns {undefined}
         */
        toggleTab: function (tabObject) {
            if (tabObject.hasClass('selected')) {
                tabObject.removeClass('selected');
            } else {
                $('.tab').removeClass('selected');
                tabObject.removeClass('unread');
                tabObject.addClass('selected');
            }
        }
    };

    /**
     * Init socket io
     *
     * @type {io}
     */
    var socket = io({reconnectionAttempts: 5});

    /**
     * On connect, emit chat-state to receive chat-state message and update the user tab
     */
    socket.on('connect', function () {
        debugHelper('socket connected');
        socket.emit('chat-state', {});
    });

    /**
     * On chat-state message, update users tab
     */
    socket.on('chat-state', function (chatState) {
        debugHelper(chatState, 'chat-state');
        DesktopManager.updateTabs(chatState);
    });

    /**
     * When receiving online state message, toggle the state button
     */
    socket.on('online-state', function(onlineState) {
        debugHelper(onlineState, 'online-state');
        $('#toggle-online .state').hide();
        var stateClass = (onlineState.online) ? 'online-state' : 'offline-state';
        $('#toggle-online .'+stateClass).show();
    });

    /**
     * When receiving a message from a user
     */
    socket.on('user-message', function(msg) {
        debugHelper(msg, 'user-message');

        var customerId = msg.customerId;

        // Add the user to the tab
        DesktopManager.addUser(customerId);

        // Find the window
        var $customerWin = jwm.findWindow(customerId);
        if ($customerWin === false) {
            $customerWin = jwm.createWindow(customerId);
        }

        // Update unread state on the window and the tab
        DesktopManager.updateUnreadState(customerId, $customerWin);
        jwm.updateUnreadState($customerWin);

        // Add message to the window
        jwm.addMessage($customerWin, msg);
    });

    socket.on('operator-message', function (msg){
        debugHelper(msg, 'operator-message');

        var customerId = msg.customerId;

        // Find the window
        var $customerWin = jwm.findWindow(customerId);
        if ($customerWin === false) {
            $customerWin = jwm.createWindow(customerId);
        }

        // Update unread state on the window and the tab
        DesktopManager.updateUnreadState(customerId, $customerWin);
        jwm.updateUnreadState($customerWin);

        // Add message to the window
        jwm.addMessage($customerWin, msg, 'operator');
    });

    /**
     * Action to toggle the online state
     */
    $('#toggle-online').click(function(event){
        event.preventDefault();
        socket.emit('online-toggle', 'toggle');
    });

    /**
     * Reload state click event
     * Emit chat-state to launch the update of the user tab
     */
    $('#reload-state').click(function(event){
        socket.emit('chat-state', {});
    });

    /**
     * Click event on a user tab
     * Hide or display the user window
     */
    $(document).on('click', '.tab', function(event){
        var customerId = $(this).data('customerid');
        var $customerWindow = $('#window-'+customerId);
        jwm.toggleWindow($customerWindow);

        var $customerTab = $('#tab-'+customerId);
        DesktopManager.toggleTab($customerTab);
    });
})(window, document, jQuery);
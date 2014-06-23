(function(window, document, $){

    var DesktopManager = {
        updateUsers: function (data) {
            var customerIds = [];
            var userTabParent = $('#users ul');
            for (id in data) {
                var customerId = data[id].customerId;
                var $customerTab = $('#tab-'+customerId);
                if ($customerTab.length === 0) {
                    userTabParent.append('<li id="tab-'+customerId+'">undefined</li>');
                }
                customerIds.push(customerId);
            }
            userTabParent.find('li').each(function(index){
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

    var socket = io();

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

    socket.on('chat-message', function(msg){
        console.log(msg);
    });

    $('#toggle-online').click(function(event){
        event.preventDefault();
        socket.emit('online-toggle', 'toggle');
    });

    $('#reload-state').click(function(event){
        socket.emit('chat-state', {});
    });
})(window, document, jQuery);
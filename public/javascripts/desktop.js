(function(window, document, $){
    $('#create-window').click(function(){
        jwm.createWindow();
    });

    var socket = io();

    socket.on('connect', function () {
        socket.emit('chat-state', {});
    });

    socket.on('chat-state', function (chatState) {
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
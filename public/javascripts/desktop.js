(function(window, document, $){
    $('#create-window').click(function(){
        jwm.createWindow();
    });

    var socket = io();
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
})(window, document, jQuery);
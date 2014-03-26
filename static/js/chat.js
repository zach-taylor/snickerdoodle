
(function (root, $) {
   var socket = io.connect("/chat");

   // Send a message to the server using Socket.io
   emit = function (event, msg) {

        socket.emit(event, msg);
    };

    // When a message is received from the server
    socket.on('reply', function(msg) {
        console.log('Server: ' + msg.data);
    });

    // When the reply button is clicked
    $('#reply-button').on('click', function(event){
        var msg = $('#reply-msg').val();
        console.log('Message: ' + msg);
        emit('chat', {data : msg});
    });

}(window, jQuery));




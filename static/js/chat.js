
(function (root, $) {
   var socket = io.connect("/chat");
   var div = document.getElementById(".chat.list.overflowed.log");
   //div.scrollTop = div.scrollHeight;

 // Auto scroll feature for the chat log. doesnt work currently will fix
    autoscroll = function (divi) {
         divi.scrollIntoView(true);
         divi.scrollTop = divi.scrollHeight;
    };


   // Send a message to the server using Socket.io
   emit = function (event, msg) {

        socket.emit(event, msg);
    };
    // Welcome message for chat
    socket.on('connected', function(socket){
        console.log('Server: Connected!');
        emit('welcome', { message: 'Welcome to SnickerDoodle' });
        $(".chat.list.overflowed.log").append("<p>Welcome to Snickerdoodle<p>");
     });
     
    // When a message is received from the server
    socket.on('reply', function(msg) {
        console.log('Server: ' + msg.data);
        $(".chat.list.overflowed.log").append("<p>Received: " + msg.data + "</p>");
        autoscroll(div);
    });

    // When the reply button is clicked
    $('#reply-button').on('click', function(event){
        var msg = $('#reply-msg').val();
        console.log('Message: ' + msg);
        emit('chat', {data : msg});
    });
    
    // Whisper function
    
    // Pause play features

}(window, jQuery));





(function (root, $) {
   var socket = io.connect("/chat");

    socket.on('reply', function(msg) {
            $('#log').append('Received : ' + msg.data);
    });

    socket.on('reply', function(msgs) {
            $('#log2').append('Received : ' + msgs.data);
    });


    $('#reply').submit(function(event){
        console.log('Replying...');
        socket.emit('chat', {data: $('#reply_data').val()});

        event.preventDefault();
    });

     $('#reply2').submit(function(event){
         console.log('Replying2...');
         socket.emit('chat', {data: $('#replymsg').val()});

         event.preventDefault();
    });
}(window, jQuery));




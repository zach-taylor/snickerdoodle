
(function (root, $) {
   var socket = io.connect("/chat");

   emit = function (event, msg) {
        // Send a message to the server using Socket.io
        console.log('emit');
        socket.emit(event, msg);
    };

    socket.on('reply', function(msg) {
      console.log('socket.on');
      logMsg(msg.data);
       //     $('#log').append('Received : ' + msg.data);
    });

    logMsg = function(msg){
      console.log(msg);
    }

    //socket.on('reply', function(msg) {
    //        $('#log2').append('Received : ' + msgs.data);
    //});


    $('#reply').submit(function(event){
      console.log('Replying...');
      console.log($('#reply_data').val());
      emit('chat', {data: $('#reply_data').val()});

      event.preventDefault();
    });

     $('#reply2').submit(function(event){
      console.log('Replying2...');
      console.log($('#reply_data').val());
      emit('chat', {data: $('#replymsg').val()});

         event.preventDefault();
    });
}(window, jQuery));




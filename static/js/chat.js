
(function (root, $) {

$(document).ready(function(){
   var io = socketio.listen(server);
   var socket = io.connect("http://127.0.0.1:5000/chat")

    socket.on('Response', funciton(msg) {
            $('#log').append('Received : ' + msg.data);
    });

    socket.on('Response', funciton(msgs) {
            $('#log2').append('Received : ' + msgs.data);
    });


    $('form#reply').submit(function(event){
        socket.emit('my reply event', {data: $('#reply_data').val()});
        return false;
    });

     $('form#reply2').submit(function(event){
        socket.emit('Reply Event', {data: $('#replymsg').val()});
        return false;
    });

});


}(window, jQuery));




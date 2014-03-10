(function (root, $) {

	var chat.socket = io.connect ('/chat');
	

	chat.socket.on('chat', function(msg) {
	   $('#log').append('<br> CHANGE THIS TO USER NAME' + ': ' + msg.data);
	});

	

	 $('form#reply').submit(function(event){
	   socket.emit('Reply Event', {data: $('#replymsg').val()});
	   return false;
	}

	 $('form#broadcast').submit(function(event) {
                socket.emit('my broadcast event', {data: $('#broadcast_data').val()});
                return false;
         });
});

}(window, jQuery));



(function (root, $) {

	var chat.socket = io.connect ('/chat');
	

	chat.socket.on('chat', function(msg) {
	   $('#log').append('<br> CHANGE THIS TO USER NAME' + ': ' + msg.data);
	});

	

	 $('form#reply').submit(function(event){
	   chat.socket.emit('Reply Event', {data: $('#replymsg').val()});
	   return false;
	});

	 $('form#broadcast').submit(function(event) {
                chat.socket.emit('my broadcast event', {data: $('#broadcast_data').val()});
                return false;
         });


}(window, jQuery));

$(document).ready(function(){
	var chat.socket2 = io.connect ('/chat');
	chat.socket2.on('my response', function(msg) {
		$('#log').append('<br> Received #' + msg.count + ': ' + msg.data);
	});
	
	$('form$reply').submit(fuction(event){
		chats.socket2.emit('my reply even', {data: $('#reply_data').val()});
		return false;
	});
	
});

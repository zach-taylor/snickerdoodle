(function (root, $) {

	var chatsocket = io.connect ('/chat');
	

	chatsocket.on('chat', function(msg) {
	   $('#log').append('<br> CHANGE THIS TO USER NAME' + ': ' + msg.data);
	});

	

	 $('form#reply').submit(function(event){
	   chatsocket.emit('Reply Event', {data: $('#replymsg').val()});
	   return false;
	});

	 


}(window, jQuery));

$(document).ready(function(){
	var chatsocket2 = io.connect ('/chat');
	chatsocket2.on('my response', function(msgs) {
		$('#log2').append('<br> Received #' + msgs.count + ': ' + msgs.data);
	});
	
	$('form$reply').submit(function(event){
		chatsocket2.emit('my reply even', {data: $('#reply_data').val()});
		return false;
	});
	
});

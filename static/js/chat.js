(function (root, $) {

	var chatsocket = io.connect ('/chat');
	

	chatsocket.on('chat', function(msg) {
	   $('#log').append('<br> CHANGE THIS TO USER NAME' + ': ' + msg.data);
	});

	

	 $('form#reply').submit(function(event){
	   chatsocket.emit('Reply Event', {data: $('#replymsg').val()});
	   return false;
	});

	 $('form#broadcast').submit(function(event) {
                chatsocket.emit('my broadcast event', {data: $('#broadcast_data').val()});
                return false;
         });


}(window, jQuery));

$(document).ready(function(){
	var chatsocket2 = io.connect ('/chat');
	chatsocket2.on('my response', function(msg) {
		$('#log2').append('<br> Received #' + msg.count + ': ' + msg.data);
	});
	
	$('form$reply').submit(fuction(event){
		chatssocket2.emit('my reply even', {data: $('#reply_data').val()});
		return false;
	});
	
});


(function (root, $) {
   var socket = io.connect("/chat");
   var div = document.getElementById(".chat.list.overflowed.log");
    
   var firstName = null;
   var lastName =  null;
   //var firstNameT = {{user.first_name}};
   //var lastNameT =  {{user.last_name}};
   var fullNameT =  $('a[href="/logout"]');
   var fullName = null;
  
 
   getnames = function () { 
      // if (firstNameT == null && lastNameT == null)
      if (fullNameT == null)
       {
           firstName = "Anonymous";
           lastName = "123";
           //fullName = firstName +"#"+ lastName;
           fullName = "Anonymous#1";
       }
       else {
           //firstName  = firstNameT;
           //lastName = lastNameT;
           //fullName = firstName + " " + lastName;
           fullName = fullNameT;
        }
   }
   
   
 
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
        getnames();
        $(".chat.list.overflowed.log").append("<p>" + fullName + ": " + msg.data + "</p>");
        
    });

    // When the reply button is clicked
    $('#reply-button').on('click', function(event){
        var msg = $('#reply-msg').val();
        console.log('Message: ' + msg);
        emit('chat', {data : msg});
    });
    
    // Getting username
       // will complete tonight after dinner (4-5-2014 Saturday)
    
    // Whisper function
         
         
    // Pause play features
         // its temp in the watch.js 

}(window, jQuery));




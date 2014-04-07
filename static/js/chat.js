
(function (root, $) {
   var socket = io.connect("/chat");
   var div = document.getElementById(".chat.list.overflowed.log");
    
   var firstName = null;
   var lastName =  null;
   //var firstNameT = {{user.first_name}};
   //var lastNameT =  {{user.last_name}};
   var fullNameT =  $('a[href="/logout"]');
   var fullNameT2S = $("#getusername").html();   
   var fullNameT2 =  Handlebars.compile (fullNameT2S);  
   var fullName = null;
  
 // {'username': u'Will Park', 'user_id': u'570048281', u'data': u'sdf'}

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

 //------- Auto scroll feature for the chat log. doesnt work currently will fix
    autoscroll = function (divi) {
         //divi.scrollIntoView(true);
         divi.scrollTop = divi.scrollHeight;
    };


   //------- Send a message to the server using Socket.io
   emit = function (event, msg) {

        socket.emit(event, msg);
    };
    //-------- Welcome message for chat
    socket.on('connected', function(socket){
        console.log('Server: Connected!');
        emit('welcome', { message: 'Welcome to SnickerDoodle' });
        $(".chat.list.overflowed.log").append("<p>Welcome to Snickerdoodle<p>");
     });
     
    //------- When a message is received from the server
    socket.on('reply', function(msg) {
        console.log('Server: ' + msg.data);
        //getnames();
        //autoscroll(div);
        $(".chat.list.overflowed.log").append("<p>" + msg.username + ": " + msg.data + "</p>");
        
    });

    // When the reply button is clicked
    $('#reply-button').on('click', function(event){
        var msg = $('#reply-msg').val();
        console.log('Message: ' + msg);
        emit('chat', {data : msg});
    });


    // Whisper function
         
         
    // Pause play features
         // its temp in the watch.js 

}(window, jQuery));




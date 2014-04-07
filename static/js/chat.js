
(function (root, $) {
   var socket = io.connect("/chat");
   var div = document.getElementById(".chat.list.overflowed.log");
   
   var vidsocket = io.connect("/video");
    
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
    
     
    //------- When a message is received from the server
    socket.on('reply', function(msg) {
        console.log('Server: ' + msg.data);
        //getnames();
        //autoscroll(div);
        fullName = msg.username;
        $(".chat.list.overflowed.log").append("<p>" + msg.username + ": " + msg.data + "</p>");
    });

    // When the reply button is clicked
    $('#reply-button').on('click', function(event){
        var msg = $('#reply-msg').val();
        console.log('Message: ' + msg);
        emit('chat', {data : msg});
    });


    // Whisper function
         
         
     vidsocket.on('player', function (data) {
        //console.log('SocketIO response:');
        //console.log(data);
        //console.log('Sending action to provider:');
        //console.log(snicker.provider);

        var action = data.action;

        if (action === 'play') {
            $(".chat.list.overflowed.log").append("<p>" + data.username + " has STARTED the video.</p>");
        } else if (action === 'pause') {
            $(".chat.list.overflowed.log").append("<p>" + data.username + " has PAUSED the video.</p>");
        } else if (action === 'change') {
            $(".chat.list.overflowed.log").append("<p>" + data.username + " has SKIPPED the video.</p>");
        }
     });
     
         // $(".chat.list.overflowed.log").append("<p>" + fullName + " has STARTED the video.</p>");
         //$(".chat.list.overflowed.log").append("<p>" + data.username + " has STARTED the video.</p>");
          //$(".chat.list.overflowed.log").append("<p>" + data.username + " has PAUSED the video.</p>");
           //$(".chat.list.overflowed.log").append("<p>" + data.username + " has SKIPPED the video.</p>");

}(window, jQuery));




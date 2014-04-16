
(function (root, $) {
   var chatsocket = io.connect("/chat");
   var div = document.getElementById(".chat.list.overflowed.log");
   
   var vidsocket = io.connect("/video");
   
    
   var firstName = null;
   var lastName =  null;
   //var firstNameT = {{user.first_name}};
   //var lastNameT =  {{user.last_name}};
   //var fullNameT =  $('a[href="/logout"]');  
   var fullName = null;
   var textcolor = null;
  
 // {'username': u'Will Park', 'user_id': u'570048281', u'data': u'sdf'}

/*   getnames = function () { 
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
   
   */
 
   //div.scrollTop = div.scrollHeight;

 //------- Auto scroll feature for the chat log. doesnt work currently will fix
    autoscroll = function () {
         //divi.scrollIntoView(true);
         $('.chat.list.overflowed.log').get(0).scrollTop = 1000000;
    };


   //------- Send a message to the server using Socket.io
   emit = function (event, msg) {

        chatsocket.emit(event, msg);
    };
    
    // Temp Changing the color of Who Joins room
    /*
   emits = function (event, test){
       chatsocket.emit(event, test);
    };
    
    chatsocket.on('welcome', function(test) {
         fullName = test.username;
         var strs = "<p>" + test.username  + test.data + "</p>";
         $(".chat.list.overflowed.log").append(strs.fontcolor("green"));
         autoscroll();
     }); */
  
    
     // When Chat connects for the first time?
     chatsocket.on('connect', function(socket){
          console.log('Server: Connected!');
          emit('chat', {data: ' has JOINED the room'});
          
         
           chatsocket.on('disconnect', function(){
           console.log('Server: Disconnected!');
           emit('chat', {data: ' has LEFT the room'});
            });
  
     });
     

     
     
    //------- When a message is received from the server
    chatsocket.on('reply', function(msg) {
        console.log('Server: ' + msg.data);
        //getnames();
        fullName = msg.username;        
        var str = "<p>" + msg.username  + msg.data + "</p>";
        var strhello = "<p>" + msg.username  + " has JOINED the room" + "</p>"
        var strbye = "<p>" + msg.username  + " has LEFT the room" + "</p>"
        if (str == strhello){
            $(".chat.list.overflowed.log").append(str.fontcolor("blue"));
            autoscroll();
        } else if (str == strbye){
            $(".chat.list.overflowed.log").append(str.fontcolor("red"));
            autoscroll();
            } else {
                 $(".chat.list.overflowed.log").append(str.fontcolor("black"));
                  autoscroll();
            }
    });
    
    

    // When the reply button is clicked
    $('#reply-button').on('click', function(event){
        var msg = $('#reply-msg');
        console.log('Message: ' + msg.val());
        emit('chat', {data : ": " + msg.val()});
        msg.val('');
       autoscroll();
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




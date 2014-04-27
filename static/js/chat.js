
(function (root, $) {
   var chatsocket = io.connect('/chat');
   var $chatList = $('.chat.list.overflowed');
   var $userlist = $('.user.list');
   var vidsocket = io.connect('/video');
   var $videoStatus = $('#video-status');
   
    
   
  // ---- Information for Will    (The chat division contains 59 spaces)
 // {'username': u'Will Park', 'user_id': u'570048281', u'data': u'sdf'}
 // 



 //------- Auto scroll feature for the chat log.
    autoscroll = function () {
         $chatList.get(0).scrollTop = 1000000;
    };


   //------- Send a message to the server using Socket.io
   emit = function (event, msg) {

        chatsocket.emit(event, msg);
    };
    
    // ------ Clears the Play pause Message list 
    clearplaypause = function () {
        $videoStatus.empty();
    };
    
    // --------- Animation for PausePlayLog
    playpauseanimate = function () {
        $videoStatus.animate({
            'marginLeft' : "-=30px"
        });
        $videoStatus.animate({
            'marginLeft' : "+=30px"
        });
        $videoStatus.animate({
            'marginLeft' : "-=30px"
        });
        $videoStatus.animate({
            'marginLeft' : "+=30px"
        });
    }; 
    
    userlistanimate = function () {
      $userlist.animate({
         'marginTop' : "+=60px"
      });
      $userlist.animate({
         'marginTop' : "-=60px"
      });
    };
    
    
        // ------------ Users button to show friends list
//     $('#users-button').on('click', function(){
//        if ($('.ui.purple.segment').hasClass('hidden')) {
//            $('.ui.purple.segment').removeClass('hidden');
//            //showlist();
//            userlistanimate().delay(100);
//        }
//        else {
//            $('.ui.purple.segment').addClass('hidden');
//            //hidelist();
//        }
//
//     });
            

 

    showlist = function() {
       $('.ui.purple.segment').show('fast');
    };

    hidelist = function() {
       $('.ui.purple.segment').hide('1000');
    };
        
        
    

    
     // When Chat connects for the first time?
     chatsocket.on('connect', function(socket){
          console.log('Server: Connected!');
          emit('chat', {data: ' has JOINED the room.'});
          
         
           chatsocket.on('disconnect', function(){
           console.log('Server: Disconnected!');
           emit('chat', {data: ' has LEFT the room.'});
            });
  
     });
     

     
     
    //------- When a message is received from the server
    chatsocket.on('reply', function(msg) {
        console.log('Server: ' + msg.data);
        //getnames();
        fullName = msg.username;        
        var str = '<p>' + msg.username  + msg.data + '</p>';
        var strhello = '<p>' + msg.username  + ' has JOINED the room.' + '</p>';
        var strbye = '<p>' + msg.username  + ' has LEFT the room.' + '</p>';
        if (str == strhello){
            $chatList.append(str.fontcolor('blue'));
            autoscroll();
        } else if (str == strbye){
            $chatList.append(str.fontcolor('red'));
            autoscroll();
            } else {
                 //$chatList.addClass('word-wrap:break-word');
                 $chatList.append(str.fontcolor('black'));
                  autoscroll();
            }
    });
    
    

    // When the reply button is clicked
    $('#reply-button').on('click', function(event){
        var msg = $('#reply-msg');
        console.log('Message: ' + msg.val());
        emit('chat', {data : ': ' + msg.val()});
        msg.val('');
       autoscroll();
    });


    // Whisper function
         
         
         
         
      // ---- Function for recording pause and play events in the PlayPause Division   
     vidsocket.on('player', function (data) {
        //console.log('SocketIO response:'    );
        //console.log(data);
        //console.log('Sending action to provider:');
        //console.log(snicker.provider);

        var action = data.action;
        var ppsstring = null;
        if (action === 'play') {
            ppsstring = '<p>' + data.username + ' has PLAYED the video.</p>';
            clearplaypause();
            $videoStatus.append(ppsstring.fontcolor('purple'));
             playpauseanimate();
        } else if (action === 'pause') {
            ppsstring = '<p>' + data.username + ' has PAUSED the video.</p>';
            clearplaypause();
            $videoStatus.append(ppsstring.fontcolor('red'));
             playpauseanimate();
        } else if (action === 'change') {
            ppsstring = '<p>' + data.username + ' has SKIPPED the video.</p>';
            clearplaypause();
            $videoStatus.append(ppsstring.fontcolor('green'));
             playpauseanimate();
        }
     });
     
         // $(".chat.list.overflowed.log").append("<p>" + fullName + " has STARTED the video.</p>");
         //$(".chat.list.overflowed.log").append("<p>" + data.username + " has STARTED the video.</p>");
          //$(".chat.list.overflowed.log").append("<p>" + data.username + " has PAUSED the video.</p>");
           //$(".chat.list.overflowed.log").append("<p>" + data.username + " has SKIPPED the video.</p>");

}(window, jQuery));




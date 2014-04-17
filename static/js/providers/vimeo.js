(function (root, $) {
    var Snicker = root.Snicker;
     var player;
     var status;
    var Vimeo = (function () {
        __extends(Vimeo, root.Snicker.Base);

        function Vimeo() {
            Vimeo.__super__.constructor.call(this);
        }

        //
        // Snickerdoodle API
        //
        
        Vimeo.prototype.init = function () {
            
        }
        
        Vimeo.prototype.playlistUrl = function(url){
            var video = {
                "provider" : "None",
                "id" : "None",
                "title" : "None",
                "icon" : "None"
            };
            video.provider = "Vimeo";
            video.id = url.split("/",4)[3];
            video.title = "None";
            video.icon = "None";
            console.log(video);
            if ( (1 == status) || (2 == status)) {
                Snicker.emit('video', {
                action: 'playlist',
                video: video
                });
            }else {
                Vimeo.prototype.swapVideo(video);
            }
            
        }

        Vimeo.prototype.checkUrl = function (url) {
            console.log('vimeo checkUrl');
            // TODO: More robust checking
            var check = url.split("/",3)[2] === "vimeo.com";
            console.log(check);
            return (check);

        };
        

        Vimeo.prototype.onPlay = function () {
            console.log('vimeo onPlay');
            player.api('play');
        };

        Vimeo.prototype.onPause = function () {
            console.log('vimeo onPAuse');
            player.api('pause');
        };

        Vimeo.prototype.onFinish = function () {
            console.log('vimeo onFinish');
        };

        Vimeo.prototype.swapVideo = function (video) {

            Snicker.emit('watch', {
                action: 'change',
                video: video,
            });
        };

        Vimeo.prototype.onChangeVideo = function (id) {
            console.log('vimeo Change Video: ' + url);
            console.log('This: ');
            console.log(id);

            var source = $('#vimeo-template').html(),
            template = Handlebars.compile(source);
            // Render template, add to html
            var html = template({video: id});
            $( "div.player").replaceWith(html);
            var f = $('iframe'),
            urlPost = f.attr('src').split('?')[0],
            status = $('.status');

            // Listen for messages from the player
            if (window.addEventListener){
                window.addEventListener('message', Vimeo.prototype.onMessageRecieved, false);
            }else {
                window.attachEvent('onmessage', Vimeo.prototype.onMessageRecieved, false);
            }
        };
        
        Vimeo.prototype.emitPause = function(){
            status = 2;
            console.log('pause');
            Snicker.emit('watch',{
                action: 'pause',
            });
        }
        
        Vimeo.prototype.emitPlay = function(){
            status = 1;
            Snicker.emit('watch',{
                action: 'play',
            });
        }
        
        Vimeo.prototype.emitEnded = function(){
            status  = -1;
            Snicker.emit('video', {
                action: 'change'
            });
        }
        
        // Handle messages received from the player
        Vimeo.prototype.onMessageRecieved  = function(e){
           var data = JSON.parse(e.data);

           switch (data.event) {
                case 'ready':
                    Vimeo.prototype.onReady();
                break;

               case 'pause':
                    Vimeo.prototype.emitPause();
                   break;

               case 'play':
                    Vimeo.prototype.emitPlay();
                    break;

                case 'finish':
                    Vimeo.prototype.emitEnded();
                    Snicker.addMessage("Next video cued. Playing...");
                    break;
           }
        }

        // Helper function for sending a message to the player
        Vimeo.prototype.onReady = function(){
            console.log('ready');
            status = 0;
            Vimeo.prototype.ready();    
        }

        /**
        * Called once a vimeo player is loaded and ready to receive
        * commands. You can add events and make api calls only after this
        * function has been called.
        */
        Vimeo.prototype.ready = function () {
            // Keep a reference to Froogaloop for this player
            player = $f(vimeoPlayer);
            player.api('play');
            player.addEventListener('pause', function() {
                console.log('pause');
                Snicker.emit('watch',{
                    action: 'pause',
                });
            });
         };
         
         

        Vimeo.prototype.status = function () {
            console.log('vimeo Status');
        };


        Vimeo.prototype.apiReady = function() {

        };

        Vimeo.prototype.onPlayerState = function(event) {
        };

        return Vimeo;
    }());

    var vimeo = new Vimeo();

    // Attach our provider
    root.Snicker.addProvider('Vimeo', vimeo);

}(window, jQuery));

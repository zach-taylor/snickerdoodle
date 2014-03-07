(function (root, $) {
    var Snicker = root.Snicker;
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

        Vimeo.prototype.checkUrl = function (url) {
            console.log('vimeo checkUrl');
            var site;
            // TODO: More robust checking
            return (url.split("/",3)[2] === "vimeo.com");

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

        Vimeo.prototype.swapVideo = function (url) {

            Snicker.emit('watch', {
                action: 'change',
                url: url,
            });
        };

        Vimeo.prototype.onChangeVideo = function (url) {
            console.log('vimeo Change Video: ' + url);
            console.log('This: ');
            console.log(this.id);

            // TODO: Better parsing for video ID, Better initial video loading.
            this.url = url;
            this.id = url.split("/",4)[3];
            var source = $('#vimeo-template').html(),
            template = Handlebars.compile(source);
            // Render template, add to html
            var html = template({video: this.id});
            $( "div.player").replaceWith(html);
            
            var f = $('iframe'),
            urlPost = f.attr('src').split('?')[0],
            status = $('.status');

            // Listen for messages from the player
            if (window.addEventListener){
                window.addEventListener('message', Vimeo.prototype.onMessageRecieved(), false);
            }else {
                window.attachEvent('onmessage', Vimeo.prototype.onMessageRecieved(), false);
            }
        };
        
        // Handle messages received from the player
        Vimeo.prototype.onMessageRecieved  = function(e){
           var data = JSON.parse(e.data);
    
           switch (data.event) {
               case 'ready':
                   Vimeo.prototype.onReady();
                   break;
           
               case 'pause':
                    Vimeo.prototype.onPause();
                    Snicker.addMessage("Player is Paused.");
                    Snicker.emit('watch', {
                       action: 'pause',
                    });
                   break;
           
               case 'play':
                    Vimeo.prototype.onPlay();
                    Snicker.addMessage("Player resumed.");
                    Snicker.emit('watch', {
                    action: 'play',
                    });
                    break;
                
                case 'finish':
                    Vimeo.prototype.onFinish();
                    Snicker.addMessage("Next video cued. Playing...");
                    break;
           }
        }
        
        // Helper function for sending a message to the player
        Vimeo.prototype.onReady = function(){
            console.log('Here');
            Vimeo.prototype.ready();    
            //post('addEventListener', 'pause');
            //post('addEventListener', 'finish');
            
        }
        
        /**
        * Called once a vimeo player is loaded and ready to receive
        * commands. You can add events and make api calls only after this
        * function has been called.
        */
        Vimeo.prototype.ready = function () {
            // Keep a reference to Froogaloop for this player
            var player = $f(vimeoPlayer);
                player.api('play');
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

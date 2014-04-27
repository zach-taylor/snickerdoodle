(function (root, $) {
    var Snicker = root.Snicker;
    var id;
    var YouTube = (function () {
        __extends(YouTube, root.Snicker.Base);

        function YouTube() {
            YouTube.__super__.constructor.call(this);
        }

        //
        // Snickerdoodle API
        //

        /**
         * Init YouTube player by adding the player location then loading the
         * YouTube API asynchronously.
         */
        YouTube.prototype.init = function () {
            console.log('initialized');
            this.$player = $('#player');

            // Grab YT player template
            var source = $('#player-template').html(),
            template = Handlebars.compile(source);

            // Render template, add to html
            var html = template();

            this.$player
                .empty()
                .html(html);

            // Asynchronously load YT scripts
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var first = document.getElementsByTagName('script')[0];
            first.parentNode.insertBefore(tag, first);
        }

        YouTube.prototype.checkUrl = function (url) {
            // TODO: More robust checking
            if (url.split('.',2)[1] === 'youtube'){
                return true;
            } else if (url.split('.',2)[1] === 'ytimg') {
                return true;
            } else {
                return false;
            }
        
        };
        
        YouTube.prototype.playlistUrl = function(url){
            var video = {
                "provider" : "None",
                "id" : "None",
                "title" : "None",
                "icon" : "None"
            };
            video.provider = "YouTube";
            video.id = url.split("=",2)[1];
            video.title = "None";
            video.icon = "None";
            console.log(video);
            return video;
        }

        YouTube.prototype.onPlay = function () {
            console.log('YT onPlay');
            this.player.playVideo();
        };

        YouTube.prototype.onPause = function () {
            console.log('YT onPAuse');
            this.player.pauseVideo();
        };

        YouTube.prototype.onFinish = function () {
            console.log('YT onFinish');
        };

        YouTube.prototype.swapVideo = function (video) {
            console.log("called Load emit");
            Snicker.emit('video', {
                action: 'load',
                video: video
            });
        };
        
        YouTube.prototype.playlist = function (video, oldProvider){
           console.log("YouTube.prototype.playlist");
           console.log(oldProvider);
            if (oldProvider === 'YouTube' ) {
           var youtube = this,
           playlist = function () {
            if ( (1 == this.player.getPlayerState()) || (2 == this.player.getPlayerState())) {
                Snicker.emit('video', {
                action: 'playlist',
                video: video
            });
            } else {
                YouTube.prototype.swapVideo(video);
            }
           };

            if (this.hasLoaded){
                console.log('API had Loaded');
                playlist.call(this);
            } else {
                console.log('API Not Loaded, Waiting');
                this.waiting = playlist.bind(this);
            }
           } else {
            Snicker.emit('video', {
                action: 'playlist',
                video: video
            });
           }
        };

        YouTube.prototype.onChangeVideo = function (id) {
            console.log('OnChangeVideo');
            console.log('This:');
            console.log(this);

            var youtube = this,
                loadVideo = function () {
                    console.log('In Load Video')
                    youtube.player.loadVideoById({
                        'videoId' : youtube.id,
                        'startSeconds': '0'
                    });
            };
            
            this.id = id;

            if (this.hasLoaded) {
                console.log('API Has Loaded');
                loadVideo.call(this);
            } else {
                console.log('API Not Loaded, Waiting');
                this.waiting = loadVideo.bind(this);
            }
        };

        YouTube.prototype.status = function () {
            console.log('YT Status');
        };

        //
        // YouTube Specific API
        //

        YouTube.prototype.apiReady = function() {
            var youtube = this;

            this.player = new YT.Player('player', {
                width: youtube.$player.width(),
                height: youtube.$player.width() / (16/9),
                events: {
                    'onReady': YouTube.prototype.onPlayerReady.bind(youtube),
                    'onStateChange': YouTube.prototype.onPlayerState.bind(youtube),
                }
            });

        };

        YouTube.prototype.onPlayerReady = function () {
            console.log('OnPlayerReady');

            this.hasLoaded = true;

            if (this.waiting) {
                this.waiting();
            }
        };

        YouTube.prototype.onPlayerState = function(event) {
            //For when a video ends.
            if (YT.PlayerState.ENDED == event.data) {
                console.log('YT Ended');
                Snicker.emit('video', {
                action: 'change'
            });
            } else if (YT.PlayerState.CUED == event.data) {
                console.log('YT Video added');
            } else if (YT.PlayerState.PAUSED == event.data) {
                console.log('YT Paused');

                Snicker.emit('video', {
                    action: 'pause'
                });
            } else if (YT.PlayerState.BUFFERING == event.data) {
                console.log('YT Buffering');
            } else if (YT.PlayerState.PLAYING == event.data) {
                console.log('YT Playing');

                Snicker.emit('video', {
                    action: 'play'
                });
            }
        }
        

        return YouTube;
    }());

    var youtube = new YouTube();

    // Attach our provider
    root.Snicker.addProvider('YouTube', youtube);

    // Expose the function to the YouTube API
    root.onYouTubeIframeAPIReady = youtube.apiReady.bind(youtube);
}(window, jQuery));

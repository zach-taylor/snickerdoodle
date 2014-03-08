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

        YouTube.prototype.init = function () {
            var source = $('#player-template').html(),
            template = Handlebars.compile(source);
            // Render template, add to html
            var html = template();
            $( "div.player").replaceWith(html);
            var tag = document.createElement('script');
            //var currentVideo;
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            console.log('YT Init');
        }

        YouTube.prototype.checkUrl = function (url) {
            console.log('YT checkUrl');

            // TODO: More robust checking
            return (url.split(".",2)[1] === "youtube");
        };

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

        YouTube.prototype.swapVideo = function (url) {

            Snicker.emit('watch', {
                action: 'change',
                url: url,
            });
        };

        YouTube.prototype.onChangeVideo = function (url) {
            console.log('YT Change Video: ' + url);
            console.log('This: ');
            console.log(this);

            // TODO: Better parsing for video ID, Better initial video loading.
            this.url = url;
            this.id = url.split("=",2)[1];
            id = url.split("=",2)[1];
            this.player.loadVideoById({
                'videoId' : this.id,
                'startSeconds': '0'
            });
        };

        YouTube.prototype.status = function () {
            console.log('YT Status');
        };

        //
        // YouTube Specific API
        //

        YouTube.prototype.apiReady = function() {
            var youtube = this;
            console.log('Api Ready');
            console.log('This: ');
            console.log(this);

            this.player = new YT.Player('player', {
                videoId: id,
                events: {
                    'onReady': YouTube.prototype.onPlayerReady.bind(YouTube),
                    'onStateChange': YouTube.prototype.onPlayerState.bind(YouTube),
                }
            });
        };

        YouTube.prototype.onPlayerReady = function () {
        };

        YouTube.prototype.onPlayerState = function(event) {
            //For when a video ends.
            if (YT.PlayerState.ENDED == event.data) {
            } else if (YT.PlayerState.CUED == event.data) {
                Snicker.addMessage("Next video cued. Playing...");
            } else if (YT.PlayerState.PAUSED == event.data) {
                Snicker.addMessage("Player is Paused.");
                Snicker.emit('watch', {
                    action: 'pause',
                });
            } else if (YT.PlayerState.BUFFERING == event.data) {
                Snicker.addMessage("Video is buffering");
            } else if (YT.PlayerState.PLAYING == event.data) {
                Snicker.addMessage("Player resumed.");
                Snicker.emit('watch', {
                    action: 'play',
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

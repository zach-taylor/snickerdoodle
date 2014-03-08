(function (root, $) {
    var Snicker = root.Snicker;
    var id;
    var DailyMotion = (function () {
        __extends(DailyMotion, root.Snicker.Base);

        function DailyMotion() {
            DailyMotion.__super__.constructor.call(this);
        }

        //
        // Snickerdoodle API
        //

        DailyMotion.prototype.init = function () {
            console.log('DM Init');

            var source = $('#player-template').html(),
            template = Handlebars.compile(source);
            // Render template, add to html
            var html = template();
            $( "div.player").replaceWith(html);
             var e = document.createElement('script'); e.async = true;
            e.src = document.location.protocol + '//api.dmcdn.net/all.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
        }


        DailyMotion.prototype.checkUrl = function (url) {
            console.log('DM checkUrl');

            // TODO: More robust checking
            return (url.split(".",2)[1] === "dailymotion");
        };

        DailyMotion.prototype.onPlay = function () {
            console.log('DM onPlay');
            this.player.playVideo();
        };

        DailyMotion.prototype.onPause = function () {
            console.log('DM onPAuse');
            this.player.pauseVideo();
        };

        DailyMotion.prototype.onFinish = function () {
            console.log('DM onFinish');
        };

        DailyMotion.prototype.swapVideo = function (url) {

            Snicker.emit('watch', {
                action: 'change',
                url: url,
            });
        };

        DailyMotion.prototype.onChangeVideo = function (url) {
            console.log('DM Change Video: ' + url);
            console.log('This: ');
            console.log(this);

            // TODO: Better parsing for video ID, Better initial video loading.
            this.url = url;
            var id1 = url.split("/")[4];
            this.id = url.split("_",2)[0];
            this.player.load(this.id);
        };

        DailyMotion.prototype.status = function () {
            console.log('DM Status');
        };

        //
        // DailyMotion Specific API
        //

        root.dmAsyncInit = function() {
            // PARAMS is a javascript object containing parameters to pass to the player if any (eg: {autoplay: 1})
            DM.init({apiKey: 'your app id', status: true, cookie: true});
            var player = DM.player("player", {video: "VIDEO_ID", width: "WIDTH", height: "HEIGHT", params: PARAMS});

            // 4. We can attach some events on the player (using standard DOM events)
            player.addEventListener("apiready", function(e)
                                    {
                                        e.target.play();
                                    });
        };

        DailyMotion.prototype.onPlayerReady = function () {
        };

        DailyMotion.prototype.onPlayerState = function(event) {
            //For when a video ends.
            if (DM.PlayerState.ENDED == event.data) {
            } else if (DM.PlayerState.CUED == event.data) {
                Snicker.addMessage("Next video cued. Playing...");
            } else if (DM.PlayerState.PAUSED == event.data) {
                Snicker.addMessage("Player is Paused.");
                Snicker.emit('watch', {
                    action: 'pause',
                });
            } else if (DM.PlayerState.BUFFERING == event.data) {
                Snicker.addMessage("Video is buffering");
            } else if (DM.PlayerState.PLAYING == event.data) {
                Snicker.addMessage("Player resumed.");
                Snicker.emit('watch', {
                    action: 'play',
                });
            }
        }

        return DailyMotion;
    }());

    var dailymotion = new DailyMotion();

    // Attach our provider
    root.Snicker.addProvider('DailyMotion', dailymotion);

    // Expose the function to the DailyMotion API
    // Comment out because of JS error...
    //root.onDailyMotionIframeAPIReady = dailymotion.apiReady.bind(dailymotion);
}(window, jQuery));

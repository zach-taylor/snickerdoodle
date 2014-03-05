(function (root, $) {
    var Snicker = root.Snicker;
    var iframe, player, status;
    var Vimeo = (function () {
        __extends(Vimeo, root.Snicker.Base);

        function Vimeo() {
            Vimeo.__super__.constructor.call(this);
        }

        //
        // Snickerdoodle API
        //

        Vimeo.prototype.init = function () {
            $('#player').html('<iframe id="player1" type="text/html" width="640" height="390" src="//player.vimeo.com/video/?api=1&player_id=player1"></iframe>');
            iframe = $('#player1')[0],
            player = $f(iframe),
            status = $('.status');
            player.api("api_play");

        }

        Vimeo.prototype.checkUrl = function (url) {
            console.log('vimeo checkUrl');
            var site;
            // TODO: More robust checking
            return (url.split("/",3)[2] === "vimeo.com");
           
        };

        Vimeo.prototype.onPlay = function () {
            console.log('vimeo onPlay');
            this.player.play();
        };

        Vimeo.prototype.onPause = function () {
            console.log('vimeo onPAuse');
            this.player.pause();
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
            console.log(this);

            // TODO: Better parsing for video ID, Better initial video loading.
            this.url = url;
            this.id = url.split("/",4)[3];
            $('#player').html('<iframe id="player1" type="text/html" width="640" height="390" src="//player.vimeo.com/video/' + this.id + '?api=1&player_id=player1"></iframe>');
            iframe = $('#player1')[0],
            player = $f(iframe),
            status = $('.status');
            player.api("api_play");
        };

        Vimeo.prototype.status = function () {
            console.log('vimeo Status');
        };


        Vimeo.prototype.apiReady = function() {
        
        };

        Vimeo.prototype.onPlayerReady = function () {
        };

        Vimeo.prototype.onPlayerState = function(event) {
        }

        return Vimeo;
    }());

    var vimeo = new Vimeo();

    // Attach our provider
    root.Snicker.addProvider('Vimeo', vimeo);
    
}(window, jQuery));

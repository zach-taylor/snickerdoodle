(function (root, $) {
    var done = false,
        $actions = $('.actions h4');

    function addMessage(message) {
        var source = $('#youtube-template').html(),
            template = Handlebars.compile(source);

        var html = template({message: message});

        $actions.after(html);
    }

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerState
            }
        });
    }

    // 4. The API will call this function when the video player is ready. Plays video specified.
    function onPlayerReady(event) {
        player.cueVideoByUrl({'mediaContentUrl': '//www.youtube.com/embed/q80hDlittrQ', 'startSeconds': '45'});
        player.playVideo();
    }

    //A function that responds to different states of the player such as ended, playing, paused, ect.
    function onPlayerState(event) {
        //For when a video ends.
        if (YT.PlayerState.ENDED == event.data) {
            addMessage("Video Ended");
            player.cueVideoByUrl({
                'mediaContentUrl': '//www.youtube.com/embed/jofNR_WkoCE',
                'startSeconds': '12'
            });

            currentVideo = '//www.youtube.com/embed/jofNR_WkoCE'

        }
        else if(YT.PlayerState.CUED == event.data){
            addMessage("Next video cued. Playing...");
            player.playVideo();
        }
        else if(YT.PlayerState.PAUSED == event.data){
            addMessage("Player is Paused.");
        }
        else if(YT.PlayerState.BUFFERING == event.data){
            addMessage("Video is buffering");
        }

        else if(YT.PlayerState.PLAYING == event.data){
            addMessage("Player resumed.");
        }
    }

    // Expose the function to the YouTube API
    root.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
}(window, jQuery));

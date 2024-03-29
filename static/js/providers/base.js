/*
 * Base class for Video Providers.
 *
 * Allows easy addition of new video providers.
 */

(function (root, $) {
    var Base = (function Base() {
        this.name = 'Base';

        Base.prototype.init = function () { };

        Base.prototype.checkUrl = function (url) {
            console.log('Base Checkurl');
            // Returns boolean if the URL matches the provider's
        };
        
        Base.prototype.playlistUrl = function(){
            //Called when adding a video to play list with url.
        };
        
        Base.prototype.playlist = function(){
            //Called when adding a video from search to playlist.
        };

        Base.prototype.onPlay = function () {
            // Called when server issues an onPlay command
        };

        Base.prototype.onPause = function () {
            // Called when server issues an onPause command
        };

        Base.prototype.onFinish = function () {
            // Called when server issues an onFinish command
        };

        Base.prototype.swapVideo = function (){
            // Called when changing video.
        };


        Base.prototype.onChangeVideo = function () {
            // Called when server switches a video
        };


        Base.prototype.status = function () {
            // Provides a status object of the currently playing video
        };
        
        Base.prototype.destroyPlayer = function(){
            //Destroys player
        };

        return Base;
    }());

    // Send out into the world
    root.Snicker.Base = Base;
}(window, jQuery));

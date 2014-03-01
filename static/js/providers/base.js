/*
 * Base class for Video Providers.
 *
 * Allows easy addition of new video providers.
 */

(function (root, $) {
    var Base = (function Base() {
        this.name = 'Base';

        function Base(url) {
            this.url = url;
        };

        Base.checkUrl = function (url) {
            console.log('Base Checkurl');
            // Returns boolean if the URL matches the provider's
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

        Base.prototype.changeVideo = function () {
            // Called when server switches a video
        };

        Base.prototype.status = function () {
            // Provides a status object of the currently playing video
        };

        return Base;
    }());

    // Send out into the world
    root.Snicker.Base = Base;
}(window, jQuery));

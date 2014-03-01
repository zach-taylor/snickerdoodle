(function (root, $) {
    var YouTube = (function () {
        __extends(YouTube, root.Snicker.Base);

        function YouTube(url) {
            console.log('YT Init with url: ' + url);
            YouTube.__super__.constructor.call(this, url);
        }

        YouTube.checkUrl = function (url) {
            console.log('YT checkUrl');
            return (url.split(".",2)[1] === "youtube");
        };

        YouTube.prototype.onPlay = function () {
            console.log('YT onPlay');
        };

        YouTube.prototype.onPause = function () {
            console.log('YT onPAuse');
        };

        YouTube.prototype.onFinish = function () {
            console.log('YT onFinish');
        };

        YouTube.prototype.changeVideo = function () {
            console.log('YT Change Video');
        };

        YouTube.prototype.status = function () {
            console.log('YT Status');
        };

        return YouTube;
    }());

    // Attach our provider
    root.Snicker.addProvider('YouTube', YouTube);
}(window, jQuery));

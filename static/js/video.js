(function (root, $) {
    var done = false;
    var videoList = [];
    var snicker = root.Snicker;



    //Take URL from input to add to video.
    $('.action input').keypress(function (e) {
        var url = $('.action input').val();
        var provider = root.Snicker.parseUrl(url);

        console.log('Provider: ' + provider);
    });

}(window, jQuery));

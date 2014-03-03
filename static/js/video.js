(function (root, $) {
    var done = false;
    var videoList = [];
    var snicker = root.Snicker;
    $actions = $('.actions h4');

    //Button to skip to next video in list
    $('.button.next').click(function() {
        var url = $('.action input').val();
        var name = root.Snicker.parseUrl(url);

        if (!name) console.log('Error here');

        snicker.changeProvider(name);

        console.log('Calling change video');
        snicker.provider.swapVideo(url);

        console.log('Provider: ' + snicker.provider);

        return;
    });

    //Take URL from input to add to video.
    $('.action input').keypress(function (e) {
        var url = $('.action input').val();
        var provider = root.Snicker.parseUrl(url);

        console.log('Provider: ' + provider);
    });

}(window, jQuery));

(function (root, $) {
    var done = false;
    var videoList = [];
    var snicker = root.Snicker;

    console.log('Binding video actions');

    //Button to skip to next video in list
    $('body').on('click', '.video-search .button.add-video', function () {
        var url = $('.video-search input.address').val();
        var name = root.Snicker.parseUrl(url);

        if (!name) {
            console.log('Error here');
            return;
        }

        snicker.changeProvider(name);
        console.log('Calling change video');
        snicker.provider.swapVideo(url);
        console.log('Provider: ');
        console.log(snicker.provider);
    });


    //Take URL from input to add to video.
    $('.action input').keypress(function (e) {
        var url = $('.action input').val();
        var provider = root.Snicker.parseUrl(url);

        console.log('Provider: ' + provider);
    });

}(window, jQuery));

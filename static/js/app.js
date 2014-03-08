(function (root, $) {
    var handler = {},
        $status = $('.menu a.status'),
        $addMovie = $('.attached.button.add');

    handler.config = {
        appId: '1409850522596219',
        cookie: true,
        xfbml: false
    };

    handler.init = function () {
        console.log('Handler.init...');
        //FB.init(handler.config);
        handler.setup();
        handler.bind();
    };

    handler.setup = function () {
        //FB.Event.subscribe('auth.authResponseChange', handler.status);
    };

    handler.status = function (resp) {
        console.log('Checking login status...');

        if (resp.status === 'connected') {
            // Login success
            handler.onLoggedIn();
        } else if (resp.status === 'not_authorized') {
            // Not authorized
            FB.login();
        } else {
            // Something else went wrong, possibly not logged in
            FB.login();
        }
    };

    handler.login = function (resp) {
        if (resp.authResponse) {
            console.log('logged in!');
        } else {
            console.log('cancelled login!');
        }
    };

    handler.onLoggedIn = function () {
        FB.api('/me', function (resp) {
            // TODO: Error checking
            //
            var context = {
                name: resp.name,
            };

            FB.api('/me/picture', function (resp) {
                // TODO: Error checking

                var source = $('#signin-template').html(),
                template = Handlebars.compile(source);

                console.log(source);
                console.log(resp);
                console.log(template);
                context.picture = resp.data.url;
                console.log(context);

                var html = template(context);
                console.log(html);

                $status.replaceWith(html);
            });
        });
    };

    handler.bind = function () {
        console.log('Bind called');
        $status.on('click', function () {
            FB.login();
        });

        $addMovie.on('click', function () {
            console.log('addMovie click');

            $('.sidebar.video-search').sidebar('toggle');
        });
    };

    $(document).ready(handler.init);
}(window, jQuery));

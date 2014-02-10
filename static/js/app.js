(function ($) {
    var handler = {};

    handler.config = {
        appId: '1409850522596219',
        status: false,
        cookie: true,
        xfbml: false
    };

    handler.init = function () {
        console.log('Handler.init...');
        FB.init(handler.config);
        handler.setup();
        handler.bind();
    };

    handler.setup = function () {
        FB.Event.subscribe('auth.authResponseChange', handler.status);
    };

    handler.status = function (resp) {
        console.log('Checking login status...');

        if (resp.status === 'connected') {
            console.log('Auth Connected!');

            FB.api('/me', function (resp) {
                // TODO: Error checking
                //
                var context = {
                    name: resp.name,
                };

                FB.api('/me/picture', function (resp) {
                    // TODO: Error checking

                    var source = $('#search-template').html(),
                        template = Handlebars.compile(source);

                    console.log(source);
                    console.log(resp);
                    console.log(template);
                    context.picture = resp.data.url;
                    console.log(context);

                    var html = template(context);
                    console.log(html);

                    $('.content').empty().append(html);
                });
            });
        } else if (resp.status === 'not_authorized') {
            console.log('Not authorized.');
            FB.login();
        } else {
            console.log('AuthResponseChange Else');
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

    handler.bind = function () {
        $('.facebook.button').on('click', function () {
            console.log('Checking status...');
            FB.login();
        });
    };

    window.fbAsyncInit = handler.init;
}(jQuery));

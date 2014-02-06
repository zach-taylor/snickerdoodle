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
        console.log('handler.setup');
        FB.Event.subscribe('auth.authResponseChange', handler.status);
    };

    handler.status = function (resp) {
        console.log('Checking login status...');
        FB.login(handler.login);
        return;
        if (resp.status === 'connected') {
            console.log('Auth Connected!');

            FB.api('/me', function (resp) {
                console.log('Good to see you, ' + resp.name + '.');
            });
        } else if (resp.status === 'not_authorized') {
            console.log('Not authorized.');
            FB.login(handler.login);
        } else {
            console.log('AuthResponseChange Else');
            FB.login(handler.login);
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
            console.debug(FB);
            console.debug(FB.getLoginStatus);
            FB.getLoginStatus(function () {console.log('cheese')}, true);
            console.log('Should get status...');
        });
    };

    window.fbAsyncInit = handler.init;
}(jQuery));

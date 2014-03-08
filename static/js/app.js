(function (root, $) {
    var handler = {},
        $status = $('.menu a.status');

    handler.config = { };

    handler.init = function () {
        console.log('Handler.init...');
        handler.setup();
        handler.bind();
    };

    handler.setup = function () {
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

    handler.login = function () {
    };

    handler.onLoggedIn = function () {
    };

    handler.bind = function () {
        console.log('Bind called');
        $status.on('click', function () {
            handler.login();
        });
    };

    $(document).ready(handler.init);
}(window, jQuery));

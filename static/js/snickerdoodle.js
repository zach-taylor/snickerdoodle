(function (root, $) {
    var snicker = {};

    snicker.provider = {};
    snicker.providers = {};
    snicker.socket = io.connect('/watch');

    //
    // Snickerdoodle Functions
    //

    snicker.addProvider = function (name, provider) {
        snicker.providers[name] = provider;
    };

    snicker.parseUrl = function (url) {
        console.log('Providers: ');
        console.debug(snicker.providers);

        for (var name in snicker.providers) {
            var provider = snicker.providers[name];

            console.log('Provider: ' + name);
            if (!snicker.providers.hasOwnProperty(name)) continue;

            // Determine if the provider can handle the given URL
            if (provider.checkUrl(url) == true) {
                return name;
            }
        }

        // No provider found
        return;
    };

    snicker.changeProvider = function (name) {
        snicker.provider = snicker.providers[name];

        // Call setup init
        snicker.provider.init();
    };

    snicker.setUrlAndProvider = function (url) {
        console.log('Setting url and provider');
        var name = root.Snicker.parseUrl(url);

        if (!name) console.log('Error here');

        snicker.changeProvider(name);

        snicker.provider.onChangeVideo(url);
    };

    snicker.addMessage = function (message) {
        var source = $('#message-template').html(),
        template = Handlebars.compile(source);

        // Render template, add to html
        var html = template({message: message});
        $actions.after(html);
    };

    //
    // SockertIO Functions
    //

    snicker.emit = function (event, data) {
        // Send a message to the server using Socket.io
        snicker.socket.emit(event, data);
    };

    snicker.socket.on('player', function (data) {
        console.log('SocketIO response:');
        console.log(data);
        console.log('Sending action to provider:');
        console.log(snicker.provider);

        var action = data.action;

        if (action === 'play') {
            snicker.provider.onPlay();
            console.log('called');
        } else if (action === 'pause') {
            snicker.provider.onPause();
        } else if (action === 'change') {
            var url = data.url || '';

            snicker.setUrlAndProvider(url);

            // TODO: Error check
            snicker.provider.onChangeVideo(url);
        }
    });

    //
    // Helper Functions
    //

    // Helper for hasOwnProperty
    root.__hasProp = Object.prototype.hasOwnProperty;

    // Helper function from CofeeScript for extending a "class"
    root.__extends = function(child, parent) {
        for (var key in parent) {
            if (root.__hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;

        return child;
    };

    //
    // Add to Root
    //

    // Create our root object
    root.Snicker = snicker;
}(window, jQuery));

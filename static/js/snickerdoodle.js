(function (root, $) {
    var snicker = {};

    snicker.provider = {};
    snicker.providers = {};
    snicker.socket = io.connect('/video');

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
                provider.init(url);
                return name;
            }
        }

        // No provider found
        return;
    };

    snicker.changeProvider = function (name) {
        snicker.provider = snicker.providers[name];
    };

    snicker.addMessage = function (message) {
        var source = $('#youtube-template').html(),
        template = Handlebars.compile(source);

        var html = template({message: message});

        $actions.after(html);
    };

    //
    // SockerIO Functions
    //

    snicker.emit = function (event, data) {
        // Send a message to the server using Socket.io
        console.log('Sending event:');
        console.log(data);
        snicker.socket.emit(event, data);
    };

    snicker.socket.on('player', function (data) {
        console.log('SocketIO response:');
        console.log(data);

        var action = data.action;

        if (action === 'play') {
            snicker.provider.onPlay();
        } else if (action === 'pause') {
            snicker.provider.onPause();
        }
    });

    // Create our root object
    root.Snicker = snicker;

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
}(window, jQuery));

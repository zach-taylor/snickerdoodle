(function (root, $) {
    var snicker = {},
        socket = io.connect();

    snicker.providers = {};

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
                return new provider(url);
            }
        }

        // No provider found
        return undefined;
    };

    snicker.emit = function (action, status) {
        // Send a message to the server using Socket.io
        socket.emit('video', {
            action: action,
            status: status
        });
    };

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

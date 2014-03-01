(function (root, $) {
    var snicker = {};

    snicker.providers = {};

    snicker.addProvider = function (name, provider) {
        snicker.providers[name] = provider;
    };

    snicker.parseURL = function (url) {
        for (var name in snicker.providers) {
            var provider = snicker.providers[name];

            if (!snicker.providers.hasOwnProperty(name)) continue;

            // Determine if the provider can handle the given URL
            if (provider.checkUrl(url) == true) {
                return provider;
            }
        }

        // No provider found
        return undefined;
    };

    // Create our root object
    root.snickerdoodle = snicker;
}(window, jQuery));

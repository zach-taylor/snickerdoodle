 snicker.setUrlAndProvider = function (url) {
        //console.log('Setting url and provider');
        var name = root.Snicker.parseUrl(url);

        if (!name) console.log('Error here');

        snicker.changeProvider(name);

        snicker.provider.onChangeVideo(url);
    };
    
    
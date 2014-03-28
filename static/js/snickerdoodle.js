(function (root, $) {
    var snicker = {},
        $addMovie = $('.attached.button.add');

    snicker.provider = {};
    snicker.providers = {};
    snicker.socket = io.connect('/video');
    var resultList;
    var oldProvider = "none";
    var videoList;

    //
    // Snickerdoodle Functions
    //

    snicker.init = function () {
        snicker.bind();
    };

    snicker.bind = function () {
        console.log('Binding video actions');

        // Button to skip to next video in list
        $('body').on('click', '.video-search .button.add-video', function () {
        });

        // Close button on Video Search Sidebar
        $('body').on('click', '.video-search .icon.close', snicker.toggleVideoSearch);

        $('.video-search form').on('submit', snicker.searchEvent);

        $('body').on('click', '.video-search .button.submit', function () {
            var val = $('.video-search input.search').val();

            //var providerName = root.Snicker.parseUrl(val);

            //if (providerName) snicker.addVideoToPlaylist(val);
            //else snicker.search(val);
        });


        $('body').on('click', '.video-search .add.icon', function (){
            var $this = $(this),
                $parent = $this.closest('.result'),
                index = $parent.attr('data-id');
                console.log(resultList.results[index].icon);
                var site = resultList.results[index].provider;
                console.log(site);
                var id = resultList.results[index].id;
                console.log(id);
                if (site === "YouTube") {
                    if (!(oldProvider === site)) {
                        snicker.changeProvider(site);
                    }
                    snicker.provider.playlist(id, site);
                }

        //if (!name) console.log('Error here');

        //snicker.provider.onChangeVideo(url);
            console.log('Clicked index: ' + index);
        });


        $addMovie.on('click', snicker.toggleVideoSearch);

        var $friends = $('.friends'),
            friendsList;

        snicker.retrieveFriends(function (data) {
            friendsList = data['results']['data'];

            var source = $('#friends-list-friend-template').html(),
            template = Handlebars.compile(source);

            // Render template, add to html
            var html = template({friends: friendsList.slice(-10)});
            $friends.empty().append(html);
        }, function (data) {

        });
    };

    snicker.retrieveFriends = function (success, err) {
        var error = err || function () {};
        $.ajax({
            type: 'GET',
            url: '/users/friends',
            success: success,
            dataType: 'json',
            error: error,
        });
    };

    snicker.addProvider = function (name, provider) {
        snicker.providers[name] = provider;
    };

    snicker.addVideoToPlaylist = function (video) {
        videoList.push(video);
        console.log('Should add video to playlist: ' + val);
    };

    snicker.searchEvent = function (e) {
        var val = $('.video-search input.search').val();
        snicker.search(val);
        e.preventDefault();

        return false;
    };

    snicker.search = function (val) {
        $.ajax({
            type: 'GET',
            url: '/videos/search',
            data: {q: val},
            success: snicker.searchResults,
            error: snicker.searchError,
        });
    };

    snicker.searchResults = function (data) {
        var $results = $('.video-search .search.results');

        console.log('Search results');
        console.log(data);
        console.log(data.results[0].icon);
        resultList = data;
        // Clear out past results
        $results.empty();

        var source = $('#search-results-template').html(),
        template = Handlebars.compile(source);

        // Render template, add to html
        var html = template(data);
        $results.append(html);
    };

    snicker.searchError = function () {
        console.log('Search error...');
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
        oldProvider = name;
    };

    snicker.toggleVideoSearch = function () {
        $('.sidebar.video-search').sidebar('toggle');
    }

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
            var video = videoList.shift();
            //snicker.setUrlAndProvider(url);
    
            // TODO: Error check
             if (video.site === "YouTube") {
                    if (!(oldProvider === video.site)) {
                        snicker.changeProvider(video.site);
                    }
                    snicker.provider.onChangeVideo(video.id);
            }
            console.log('changeing');
        } else if (action === 'playlist') {
            var playlist = new playlist();
            playlist.id = data.id || '';
            playlist.site = data.site || '';
            snicker.addVideoToPlaylist(playlist);
        } else if (action === 'load') {
            snicker.provider.onChangeVideo(data.id);
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

    // Call Snicker's On Load
    $(document).ready(snicker.init);
}(window, jQuery));

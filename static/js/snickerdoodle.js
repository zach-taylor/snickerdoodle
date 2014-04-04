(function (root, $) {
    var snicker = {},
        $addMovie = $('.attached.button.add'),
        $friendsToggle = $('.js-friends-toggle');

    var resultList;
    var oldProvider = "none";
    var videoList = [];
    var siteList = [];
    var titleList = [];

    //
    // Snickerdoodle Values
    //
    snicker.friends = [];
    snicker.provider = {};
    snicker.providers = {};
    snicker.socket = io.connect('/video');

    //
    // Snickerdoodle Functions
    //

    snicker.init = function () {
        snicker.bind();
    };

    snicker.bind = function () {
        //console.log('Binding video actions');

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

        // Add video from search.
        $('body').on('click', '.video-search .add.icon', function (){
            var $this = $(this),
                $parent = $this.closest('.result'),
                index = $parent.attr('data-id');
                var site = resultList.results[index].provider;
                var id = resultList.results[index].id;
                titleList.push(resultList.results[index].title);
                if (site === "YouTube") {
                    if (!(oldProvider === site)) {
                        snicker.changeProvider(site);
                    }
                    snicker.provider.playlist(id, site);
                }

        //if (!name) console.log('Error here');

        //snicker.provider.onChangeVideo(url);
        });
        
        $('body').on('click', '.step.forward.icon', function () {
            Snicker.emit('video', {
                action: 'change'
            });
        })


        $addMovie.on('click', snicker.toggleVideoSearch);

        $friendsToggle.on('click', snicker.toggleFriends);
        $('.js-friends-close').on('click', snicker.toggleFriends);

        //
        // Setup Friend Filtering
        //


        var $friends = $('.friends-list'),
            $input = $('#search');



        snicker.retrieveFriends(function (data) {
            snicker.friends = data['results']['data'];

            snicker.renderFriends($friends, '#friends-list-friend-template');
        }, function (data) {
            // TODO: Error when can't retrieve friends
        });

        $input.liveSearch({
            search: function () {
                var friends = snicker.filterFriends($input.val());
                snicker.renderFriends($friends, '#friends-list-friend-template', friends);
            },
            delay: 400,
        });

        $friends.on('click', '.item.friend', function () {
            console.log('friend clicked!');
        });
    };

    //
    // Friends Functions
    //

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

    snicker.renderFriends = function (node, name, list) {
        var friends = list || snicker.friends;

        var source = $(name).html(),
            template = Handlebars.compile(source);

        // Render template, add to html
        var html = template({friends: friends.slice(-5)});

        // Empty then append
        node.empty().append(html);
    };

    snicker.filterFriends = function (val) {
        return snicker.friends.filter(function (e) {
            var names = e.name.match(/\S+/g);

            for (var i = 0; i < names.length; i += 1) {
                if (names[i].toLowerCase().indexOf(val.toLowerCase()) === 0) return true;
                else if (e.name.toLowerCase().indexOf(val.toLowerCase()) === 0) return true;
            }

            return false;
        });
    };

    //
    // Video Search Functions
    //

    snicker.addProvider = function (name, provider) {
        snicker.providers[name] = provider;
    };

    snicker.addVideoToPlaylist = function (video) {
        videoList.push(video.id);
        siteList.push(video.site);
    };
    
    snicker.displayPlaylist = function() {
        //console.log('display list');
        $('.displayplaylist').empty();
        var source = $('#display-playlist').html(),
         template = Handlebars.compile(source);

        // Render template, add to html
        var html = template();
        $('.displayplaylist').append(html);
        
    }
    
    snicker.currentVideo = function() {
       $('.controls .current').empty();
        var curvideo = titleList.shift();
        console.log('current video');
        console.log(curvideo);
       var source = $('#current-template').html(),
         template = Handlebars.compile(source);

        // Render template, add to html
        var html = template({current: curvideo});
        $('.controls .current').append(html);
    }
    
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

        //console.log('Search results');
        //console.log(data);
        //console.log(data.results[0].icon);
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
        //console.log('Providers: ');
        //console.debug(snicker.providers);

        for (var name in snicker.providers) {
            var provider = snicker.providers[name];

            //console.log('Provider: ' + name);
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

    snicker.toggleFriends = function () {
        $('.sidebar.friends').sidebar('toggle');
    }

    snicker.setUrlAndProvider = function (url) {
        //console.log('Setting url and provider');
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
        //console.log('SocketIO response:');
        //console.log(data);
        //console.log('Sending action to provider:');
        //console.log(snicker.provider);

        var action = data.action;

        if (action === 'play') {
            snicker.provider.onPlay();
        } else if (action === 'pause') {
            snicker.provider.onPause();
        } else if (action === 'change') {
            var id = videoList.shift();
            var site = siteList.shift();
            snicker.displayPlaylist();
            snicker.currentVideo();
            //snicker.setUrlAndProvider(url);
            // TODO: Error check
             if (site === "YouTube") {
                    if (!(oldProvider === site)) {
                        snicker.changeProvider(site);
                    }
                    snicker.provider.onChangeVideo(id);
            }
        } else if (action === 'playlist') {
            var playlist = this;
            playlist.id = data.id || '';
            playlist.site = data.site || '';
            snicker.addVideoToPlaylist(playlist);
        } else if (action === 'load') {
            snicker.displayPlaylist();
            snicker.currentVideo();
            if (data.site === "YouTube") {
                    if (!(oldProvider === data.site)) {
                        snicker.changeProvider(data.site);
                    }
                    snicker.provider.onChangeVideo(data.id);
            }
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

(function (root, $) {
    var snicker = {},
        $addMovie = $('.attached.button.add');
        $videoSidebar = $('.sidebar.video-search'),
        $friendSidebar = $('.sidebar.friends'),
        $addFriend = $('.js-friends-toggle');


    var resultList;
    var oldProvider = "none";
    var videoList = [];
    var siteList = [];
    var titleList = [];
    
    var ppc = 0; 

    //
    // Snickerdoodle Values
    //
    snicker.provider = {};
    snicker.providers = {};
    snicker.socket = io.connect('/video');

    //
    // Snickerdoodle Functions
    //

    snicker.init = function () {
        snicker.bind();
        snicker.setupFriends();
    };

    snicker.setupFriends = function () {
        var handler = {},
            $friends = $('.sidebar.friends .friends-list'),
            $input = $('input.search.friends');

        handler.clicked = function () {
            console.log('friend clicked');
        };


        root.Friends.setup({
            input: $input,
            list: $friends,
            template: '#friends-list-friend-template',
            clicked: handler.clicked,
        });

        root.Friends.retrieveFriends();
    };

    snicker.bind = function () {
        //console.log('Binding video actions');

        // Button to skip to next video in list
        $('body').on('click', '.video-search .button.add-video', function () {
        });

        // Close sidebars
        $('body').on('click', '.sidebar .icon.close', snicker.closeSidebars);

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

                if (titleList.length <= 3) {
                    snicker.displayPlaylist();
                }
        });


        $('#js-create-room-button').click(function () {
            var $friends = $('.friends'),
                $input = $('#search');

            $('.ui.modal').modal('show');

            root.Friends.setup({
                input: $input,
                list: $friends,
                template: '#friends-list-friend-template',
                clicked: handler.clicked,
            });

            root.Friends.retrieveFriends();
        });



        $('body').on('click', '.step.forward.icon', function () {
            Snicker.emit('video', {
                action: 'change'
            });
        })


        $addMovie.on('click', snicker.showVideoSearch);
        $addFriend.on('click', snicker.showFriends);
    };

    snicker.closeSidebars = function () {
        $friendSidebar.sidebar('hide');
        $videoSidebar.sidebar('hide');
    }

    //
    // Friends UI Functions
    //

    snicker.showFriends = function () {
        $videoSidebar.sidebar('hide');
        $friendSidebar.sidebar('show');
    }

    //
    // Video Search Functions
    //

    snicker.showVideoSearch = function () {
        $friendSidebar.sidebar('hide');
        $videoSidebar.sidebar('show');
    }

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
        if (titleList.length == 0) {
            var html = template();
        } else if (titleList.length ==1) {
            var html = template({one : titleList[0]});
        } else if (titleList.length ==2) {
            var html = template({one:titleList[0], two:titleList[1]});
        }else{
        // Render template, add to html
        var html = template({one:titleList[0], two:titleList[1], three:titleList[2]});
        }
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
        var val = $('input.search.videos').val();
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

    //
    // SockertIO Functions
    //

    snicker.emit = function (event, data) {
        // Send a message to the server using Socket.io
        snicker.socket.emit(event, data);
    };

    snicker.addMessage = function (message) {
        var source = $('#message-template').html(),
        template = Handlebars.compile(source);

        // Render template, add to html
        var html = template({message: message});
        $actions.after(html);
    };

    snicker.socket.on('player', function (data) {
        //console.log('SocketIO response:');
        //console.log(data);
        //console.log('Sending action to provider:');
        //console.log(snicker.provider);

        var action = data.action;

        if (action === 'play') {
            snicker.provider.onPlay();
            //$(".chat.list.overflowed.log").append("<p>A User: has STARTED the video.</p>");
        } else if (action === 'pause') {
            snicker.provider.onPause();
           // $(".chat.list.overflowed.log").append("<p>A User: has PAUSED the video.</p>");
        } else if (action === 'change') {
            var id = videoList.shift();
            var site = siteList.shift();
            snicker.currentVideo();
            snicker.displayPlaylist();
           // $(".chat.list.overflowed.log").append("<p>A User: has SKIPPED the video.</p>");
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
            snicker.currentVideo();
            snicker.displayPlaylist();
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

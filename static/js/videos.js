(function (root, $) {
    var $addMovie = $('.attached.button.add');
        $videoSidebar = $('.sidebar.video-search'),
        $friendSidebar = $('.sidebar.friends'),
        $addFriend = $('.js-friends-toggle'),
        $invited = $('.friends.invited'),
        $input = $('input.search.friends');

    var snicker = {},
        invited = {};

    var resultList;
    var oldProvider = "none";
    var playlist = [];
    var listIndex = 0;

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

    snicker.friendClicked = function (friend) {
        invited[friend.id] = friend;
        console.log('Adding ' + friend.id);
        console.log(invited);

        snicker.renderInvited();
    };

    snicker.renderInvited = function () {
        var source = $('#friends-invited-template').html();
        var template = Handlebars.compile(source);
        var data = {};

        if (Object.keys(invited).length !== 0) {
            data['invited'] = invited;
        }

        // Render template, add to html
        var html = template(data);
        $invited.empty().append(html);
    };

    snicker.setupFriends = function () {
        var handler = {},
            $friends = $('.sidebar.friends .friends-list');

        handler.clicked = function () {
            console.log('friend clicked');
        };


        root.Friends.setup({
            input: $input,
            list: $friends,
            template: '#friends-list-friend-template',
            clicked: snicker.friendClicked,
        });

        root.Friends.retrieveFriends();
        //root.Friends.retrieveSnickerdoodleFriends();
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

            var providerName = root.Snicker.parseUrl(val);

            if (providerName == "Vimeo" || providerName == "YouTube"){
                console.log(val);
                snicker.provider.playlistUrl(val);
            } else snicker.search(val);
        });

        // Add video from search.
        $('body').on('click', '.video-search .add.icon', function (){
            var $this = $(this),
                $parent = $this.closest('.result'),
                index = $parent.attr('data-id');
                if (resultList.results[index].provider === "YouTube") {
                    console.log(resultList.results[index].provider);
                    if (!(oldProvider === resultList.results[index].provider)) {
                        snicker.changeProvider(resultList.results[index].provider);
                    }

                    snicker.provider.playlist(resultList.results[index]);
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
        });

        //
        // Friend Invitations
        //

        $invited.on('click', '.friend .icon', function (e) {
            var $this = $(this),
                $parent = $this.parent(),
                $pparent = $parent.parent(),
                id = $parent.attr('data-id');

            if (invited[id]) {
                delete invited[id];
            }

            $pparent.remove();

            snicker.renderInvited();

            return false;
        });

        $invited.on('click', '.button.positive', function (e) {
            console.log('Sending invitations');

            $.ajax({
                type: 'POST',
                url: '/friends/invite/',
                dataType: 'json',
                data: {
                    'receivers': Object.keys(invited),
                    'url': window.location.href,
                },
                success: function () {
                    console.log('Success called');
                }
            });

            // Clear the friends selected
            invited = {};
            snicker.renderInvited();

            // Close and clean up
            snicker.closeSidebars();
            snicker.clearSearch();
        });

        $addMovie.on('click', snicker.showVideoSearch);
        $addFriend.on('click', snicker.showFriends);
    };

    snicker.closeSidebars = function () {
        $friendSidebar.sidebar('hide');
        $videoSidebar.sidebar('hide');
    };

    snicker.clearSearch = function () {
        $input.val('');
    };

    //
    // Friends UI Functions
    //

    snicker.showFriends = function () {
        $videoSidebar.sidebar('hide');
        $friendSidebar.sidebar('show');
    };

    //
    // Video Search Functions
    //

    snicker.showVideoSearch = function () {
        $friendSidebar.sidebar('hide');
        $videoSidebar.sidebar('show');
    };

    snicker.addProvider = function (name, provider) {
        snicker.providers[name] = provider;
    };

    snicker.addVideoToPlaylist = function (video) {
        console.log("addVideoToPlaylist");
        playlist.push(video);
        listIndex++;
        console.log(playlist);
        if (playlist.length <= 4) {
            snicker.displayPlaylist();
        }
    };

    snicker.displayPlaylist = function() {
        //console.log('display list');
        $('.displayplaylist').empty();
        var source = $('#display-playlist').html(),
         template = Handlebars.compile(source);
        if (playlist.length == 0) {
            var html = template();
        } else if (playlist.length ==1) {
            var html = template({one : playlist[0].title, icon1 : playlist[0].icon});
        } else if (playlist.length ==2) {
            var html = template({one:playlist[0].title, icon1:playlist[0].icon, two:playlist[1].title, icon2:playlist[1].icon });
        } else {
            // Render template, add to html
            var html = template({one:playlist[0].title, icon1:playlist[0].icon, two:playlist[1].title, icon2:playlist[1].icon, three:playlist[2].title, icon3:playlist[2].icon});
        }
        $('.displayplaylist').append(html);
    };

    snicker.currentVideo = function() {
       $('.controls .current').empty();
        var curvideo = playlist.shift();
        console.log('current video');
        console.log(curvideo.title);
       var source = $('#current-template').html(),
         template = Handlebars.compile(source);

        // Render template, add to html
        var html = template({current: curvideo.title});
        $('.controls .current').append(html);
    };

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

            console.log('Provider: ' + name);
            if (!snicker.providers.hasOwnProperty(name)) continue;

            // Determine if the provider can handle the given URL
            if (provider.checkUrl(url) == true) {
                snicker.changeProvider(name);
                return name;
            }
        }

        // No provider found
        return;
    };

    snicker.changeProvider = function (name) {
        console.log(name);
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
            console.log("change");
           // $(".chat.list.overflowed.log").append("<p>A User: has SKIPPED the video.</p>");
            // TODO: Error check
             if (playlist[0].provider === "YouTube"  || playlist[0].provider === "Vimeo") {
                    if (!(oldProvider === playlist[0].provider )) {
                        snicker.changeProvider(playlist[0].provider );
                    }
                    snicker.provider.onChangeVideo(playlist[0].id);
                    snicker.currentVideo();
                    snicker.displayPlaylist();
            }
        } else if (action === 'playlist') {
            snicker.addVideoToPlaylist(data.video);
        } else if (action === 'load') {
            playlist.push(data.video);
            console.log("playlist" + playlist[0].provider  + playlist[0].id);
            if (playlist[0].provider  === "YouTube" || playlist[0].provider === "Vimeo") {
                    if (!(oldProvider === playlist[0].provider )) {
                        console.log("changing provider");
                        snicker.changeProvider(playlist[0].provider );
                    }
                    snicker.provider.onChangeVideo(playlist[0].id);
            }
            snicker.currentVideo();
            snicker.displayPlaylist();
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

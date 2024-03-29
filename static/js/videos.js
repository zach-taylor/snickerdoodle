(function (root, $) {
    var $addMovie = $('.attached.button.add'),
        $videoSidebar = $('.sidebar.video-search'),
        $friendSidebar = $('.sidebar.friends'),
        $addFriend = $('.attached.button.invite'),
        $invited = $('.friends.invited'),
        $input = $('input.search.friends'),
        $playlist = $('.displayplaylist');

    var snicker = {},
        invited = {};
    var resultList;
    var oldProvider = 'none';
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
        snicker.checkUrl();
    };

    snicker.checkUrl = function () {
        var id,
            qs = (function(a) {
            if (a == "") return {};
            var b = {};
            for (var i = 0; i < a.length; ++i) {
                var p=a[i].split('=');
                if (p.length != 2) continue;
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
            return b;
        })(window.location.search.substr(1).split('&'));

        id = qs['trending'];

        if (!id) return;

        snicker.changeProvider('YouTube');
        snicker.provider.onChangeVideo(id);
        snicker.currentVideo();
        snicker.displayPlaylist();
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
    };

    snicker.bind = function () {
        console.log('Binding video actions');
        snicker.socket.on('connect', function() {
            console.log('connected');
            snicker.emit('join', {});
        });

        snicker.getRoomVideos();

        // Close sidebars
        $('body').on('click', '.sidebar .icon.close', snicker.closeSidebars);

        $('.video-search form').on('submit', snicker.searchEvent);

        $('body').on('click', '.video-search .button.submit', function () {
            var val = $('.video-search input.search').val();

            var providerName = root.Snicker.parseUrl(val);

            if (providerName == 'Vimeo' || providerName == 'YouTube'){
                console.log(val);
                if (!(oldProvider === providerName) && (oldProvider === 'none')) {
                        snicker.changeProvider(providerName);
                    }
                if (providerName === 'YouTube') {
                    console.log(providerName);
                    snicker.YTInfo(val);
                }else if (providerName === 'Vimeo'){
                    console.log(providerName);
                    snicker.VimeoInfo(val);
                }
            } else snicker.search(val);
        });

        // Add video from search.
        $('body').on('click', '.video-search .item', function (){
            var $this = $(this),
                $parent = $this.closest('.result'),
                index = $parent.attr('data-id');
                if (resultList.results[index].provider === 'YouTube') {
                    console.log(resultList.results[index].provider);
                    if (!(oldProvider === resultList.results[index].provider)  && (oldProvider === 'none')) {
                        snicker.changeProvider(resultList.results[index].provider);
                    }

                    snicker.providers['YouTube'].playlist(resultList.results[index], oldProvider);
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
            snicker.emit('video', {
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

    snicker.getRoomVideos = function() {
        $.ajax({
            type: 'GET',
            url: '/api/rooms/' + snicker.room + '/videos',
            success: function(data){
                console.log(data['videos']);
                playlist = data['videos'];
                snicker.displayPlaylist();
            },
            error: snicker.searchError
        });
    };

    snicker.YTInfo = function(val) {
            $.ajax({
            type: 'GET',
            url: '/videos/search',
            data: {q: val},
            success: function(data){
                    var video = {
                            "provider" : data.results[0].provider,
                            "id" : data.results[0].id,
                            "title" : data.results[0].title,
                            "icon" : data.results[0].icon
                        };
                        snicker.getInfo(video);
                         },
            error: snicker.searchError,
        });
    };
    
    snicker.VimeoInfo = function(val) {
            console.log("VimeoInfo");
            var id = (val.split("/",4)[3]);
            $.getJSON("http://vimeo.com/api/v2/video/" + id + ".json?callback=?",
                       {format: "json"},
                         function(data){
                            var video = {
                "provider" : "Vimeo",
                "id" : data[0].id,
                "title" : data[0].title,
                "icon" : data[0].thumbnail_small
                        };
                        snicker.getInfo(video);
                         });
    }
    
    snicker.getInfo = function(data) {
        console.log(data);
        if (!(oldProvider === data.provider)  && (oldProvider === 'none')) {
            snicker.changeProvider(data.provider);
        }

        snicker.providers[data.provider].playlist(data, oldProvider);
    }
    
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
        console.log('addVideoToPlaylist');
        playlist.push(video);
        snicker.displayPlaylist();
    };

    snicker.displayPlaylist = function() {
        var source = $('#display-playlist').html(),
            template = Handlebars.compile(source);

        var html = template({videos: playlist});
        $playlist.html(html);
        //$playlist.children()[listIndex].addClass('ui green');
    };

    snicker.currentVideo = function() {
       listIndex++;
       var curvideo = playlist[listIndex];
       console.log('current video');
       var source = $('#current-template').html(),
           template = Handlebars.compile(source);

        // Render template, add to html
        var html = template({current: curvideo.title});
        $('.controls .current').html(html);
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
        console.log(name);
        snicker.provider = snicker.providers[name];
        snicker.provider.init();
        oldProvider = name;
    };

    //
    // SocketIO Functions
    //

    snicker.emit = function (event, data) {
        // Send a message to the server using Socket.io
        data['room'] = snicker.room;
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
            snicker.provider.curTime();
             var Seektime = data.time;           
            snicker.provider.onPlay(Seektime);
        } else if (action === 'pause') {
             snicker.provider.curTime();
             var Seektime = data.time;     
            snicker.provider.onPause(Seektime);
        } else if (action === 'change') {
            console.log('change');
            // TODO: Error check
             if (playlist[listIndex].provider === 'YouTube'  || playlist[listIndex].provider === 'Vimeo') {
                    console.log(oldProvider);
                    console.log(playlist[listIndex].provider);
                    if (!(oldProvider === playlist[listIndex].provider )) {
                        snicker.changeProvider(playlist[listIndex].provider );
                    }
                    snicker.provider.onChangeVideo(playlist[listIndex].id);
                    snicker.currentVideo();
                    snicker.displayPlaylist();
            }
        } else if (action === 'playlist') {
            snicker.addVideoToPlaylist(data.video);
        } else if (action === 'load') {
            playlist.push(data.video);
            console.log('playlist' + playlist[listIndex].provider  + playlist[listIndex].id);
            if (playlist[listIndex].provider  === 'YouTube' || playlist[listIndex].provider === 'Vimeo') {
                    if (!(oldProvider === playlist[listIndex].provider )) {
                        console.log('changing provider');
                        snicker.changeProvider(playlist[listIndex].provider );
                    }
                    snicker.provider.onChangeVideo(playlist[listIndex].id);
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

    // Helper function from CoffeeScript for extending a "class"
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

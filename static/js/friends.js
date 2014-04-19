(function (root, $) {
    var friend_list = {};

    //
    // Friends Values
    //

    friend_list.friends = [];
    friend_list.iden = function () {};

    //
    // Friend List Functions
    //

    friend_list.setup = function (options) {
        var settings = $.extend({
            input: undefined,
            list: undefined,
            template: '',
            clicked: friend_list.iden,
        }, options);

        if (settings.list) {
            friend_list.ele = settings.list;

            friend_list.ele.on('click', '.item.friend', function () {
                var $this = $(this),
                    id = $this.attr('data-index');

                if (id >= 0 && id < friend_list.friends.length) {
                    settings.clicked(friend_list.friends[id]);
                }
            });
        }

        if (settings.input) {
            friend_list.input = settings.input;

            friend_list.input.liveSearch({
                search: function () {
                    var filtered = friend_list.filterFriends(friend_list.input.val());
                    friend_list.renderFriends(filtered);
                },
                delay: 400,
            });
        }

        // Attach for the future
        friend_list.settings = settings;

        // TEsting invite code
        $('.invite.button').click(function (e) {
            $.ajax({
                type: 'POST',
                url: '/friends/invite/',
                data: {
                    'receiver': '503244629',
                    'mesg': 'Mmmm... snickerdoodles...',
                },
                dataType: 'json',
                success: friend_list.success,
                error: friend_list.error,
            });
        });
    };

    friend_list.retrieveFriends = function () {
        console.log('Retrieving friends list');

        $.ajax({
            type: 'GET',
            url: '/friends/',
            dataType: 'json',
            success: friend_list.success,
            error: friend_list.error,
        });
    };

    friend_list.retrieveSnickerdoodleFriends = function () {
        console.log('Retrieving Snickerdoodle friends list');

        $.ajax({
            type: 'GET',
            url: '/api/users/me',
            dataType: 'json',
            success: friend_list.success2,
            error: friend_list.error,
        });
    };

    friend_list.sendFriendRequest = function (user_id) {
        $.ajax({
            type: 'POST',
            url: '/api/friends',
            data: JSON.stringify({
                'user': {
                    'id': user_id
                }
            }),
            dataType: 'json',
            success: friend_list.success,
            error: friend_list.error,
        });
    };

    friend_list.success2 = function (data) {
        friend_list.snickerdoodle_friends = data['user']['friends'];

        for (var i = 0; i < friend_list.snickerdoodle_friends.length; i += 1) {
            friend_list.snickerdoodle_friends[i]['index'] = i;
        }

        friend_list.renderFriends(friend_list.snickerdoodle_friends);
    };

    friend_list.error = function () {
        // TODO: Show error
    };

    friend_list.success = function (data) {
        friend_list.friends = data['results']['data'];

        for (var i = 0; i < friend_list.friends.length; i += 1) {
            friend_list.friends[i]['index'] = i;
        }

        friend_list.renderFriends();
    };

    friend_list.renderFriends = function (list) {
        var friends = list || [];
            name = friend_list.settings.template;

        if (!name) return;

        var source = $(name).html(),
            template = Handlebars.compile(source);

        // Render template, add to html
        var html = template({friends: friends.slice(-5)});

        // Empty then append
        friend_list.ele.empty().append(html);
    };

    friend_list.filterFriends = function (val) {
        if (!val) return [];

        return friend_list.friends.filter(function (e) {
            var names = e.name.match(/\S+/g);

            for (var i = 0; i < names.length; i += 1) {
                if (names[i].toLowerCase().indexOf(val.toLowerCase()) === 0) return true;
                else if (e.name.toLowerCase().indexOf(val.toLowerCase()) === 0) return true;
            }

            return false;
        });
    };

    //
    // Add to Root
    //

    // Create our root object
    root.Friends = friend_list;

    // Call Snicker's On Load
    $(document).ready(friend_list.init);
}(window, jQuery));

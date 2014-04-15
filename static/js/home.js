(function (root, $) {
    var handler = {},
        $invited = $('.selection.list.invited'),
        invited = [];

    handler.clicked = function (friend) {
        var source = $('#friends-label').html()
        var template = Handlebars.compile(source);

        // Render template, add to html
        var html = template(friend);
        $invited.append(html);
        invited[friend.id] = friend;
    };

    $invited.on('click', '.ui.label.friend .icon', function (e) {
        var $this = $(this),
            $parent = $this.parent(),
            id = $parent.attr('data-id');

        if (invited[id]) {
            delete invited[id];
        }

        $parent.remove();

        return false;
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
        root.Friends.retrieveSnickerdoodleFriends();
    });

    $('input.button.create-room').on('click', function () {
        // Send request here
    });
}(window, jQuery));

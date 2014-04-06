(function (root, $) {
    var handler = {};

    handler.clicked = function () {
        console.log('friend clicked');
    };

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
}(window, jQuery));

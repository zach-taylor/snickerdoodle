(function (root, $) {
    $('#js-create-room-button').click(function(){
        var $friends = $('.friends'),
            $input = $('#search');

        $('.ui.modal').modal('show');

        root.Snicker.retrieveFriends(function (data) {
            root.Snicker.friends = data['results']['data'];

            root.Snicker.renderFriends($friends, '#friends-list-friend-template');
        }, function (data) {
            // TODO: Error when can't retrieve friends
        });

        $input.liveSearch({
            search: function () {
                var friends = root.Snicker.filterFriends($input.val());
                root.Snicker.renderFriends($friends, '#friends-list-friend-template', friends);
            },
            delay: 400,
        });
    });

    $('.friends').on('click', '.item.friend', function () {
        console.log('friend clicked!');
    });
}(window, jQuery));

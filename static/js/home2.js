(function (root, $) {
    $('#js-create-room-button').click(function(){
        var $friends = $('.friends'),
            friendsList;

        $('.ui.modal').modal('show');

        root.Snicker.retrieveFriends(function (data) {
            friendsList = data['results']['data'];

            var source = $('#friends-list-friend-template').html(),
            template = Handlebars.compile(source);

            // Render template, add to html
            var html = template({friends: friendsList.slice(-5)});
            $friends.empty().append(html);
        }, function (data) {

        });
    });
}(window, jQuery));

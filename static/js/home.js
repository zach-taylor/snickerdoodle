(function (root, $) {
    var handler = {},
        $invited = $('.selection.list.invited'),
        $modal = $('.ui.modal'),
        $create = $('#js-create-room-button'),
        $go = $('.button.create-room'),
        $form = $('#room-form'),
        invited = {};

    handler.clicked = function (friend) {
        var source = $('#friends-label').html()
        var template = Handlebars.compile(source);

        // Render template, add to html
        var html = template(friend);
        $invited.append(html);
        invited[friend.id] = friend;
        console.log('Adding ' + friend.id);
        console.log(invited);
    };

    handler.onApprove = function () {
        console.log('Go clicked');
        $create.addClass('loading');

        $.ajax({
            type: 'POST',
            url: '/friends/invite/',
            dataType: 'json',
            data: {
                'receivers': Object.keys(invited),
                'mesg': 'hi there',
            },
            success: function () {
                console.log('Success called');
                $form.submit();
            }
        });
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

    $create.click(function () {
        var $friends = $('.friends'),
            $input = $('#search');

        console.log(invited);
        $modal.modal('setting', {
            onApprove: handler.onApprove,
        }).modal('show');

        root.Friends.setup({
            input: $input,
            list: $friends,
            template: '#friends-list-friend-template',
            clicked: handler.clicked,
        });

        root.Friends.retrieveFriends();
        root.Friends.retrieveSnickerdoodleFriends();
    });

    $go.click(function (e) {
    });
}(window, jQuery));

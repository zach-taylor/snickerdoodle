(function (root, $) {
    var $modal = $('.ui.modal'),
        $create = $('#js-create-room-button'),
        $input = $('#name');

    $create.click(function () {
        $modal.modal('show', function () {
            $input.focus();
        }).modal('show');
    });
}(window, jQuery));

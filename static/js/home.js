(function (root, $) {
    var $modal = $('.ui.modal'),
        $create = $('#js-create-room-button');

    $create.click(function () {
        $modal.modal('show');
    });
}(window, jQuery));

(function (root, $) {
    $('.trending').on('click', '.item.video', function (e) {
        var $this = $(this),
            $form = $('#trending');

        $('#input-trending').val($this.attr('data-id'));
        $form.submit();
    });
}(window, jQuery));

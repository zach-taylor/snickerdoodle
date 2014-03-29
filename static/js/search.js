(function (root, $) {
    var handler = {
        init: function (options) {
            return this.each(function () {
                var
                    $this = $(this),
                    settings = $.extend({
                        delay: 200,
                        search: function () {}
                    }, options);

                handler.settings = settings;
                $(this).keyup(handler.process)
            });
        },
        resetTimer: function (timer) {
            if (timer) clearInterval(timer);
        },
        process: function () {
            var $input = $(this);

            if (handler.previous != $input.val()) {
                handler.resetTimer(handler.timer);

                handler.timer = setTimeout(handler.settings.search, handler.settings.delay);
                handler.previous = $input.val();
            }
        }
    };

    $.fn.liveSearch = function (method) {
        if (handler[method]) {
            return handler[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return handler.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.search');
        }
    };
}(window, jQuery));

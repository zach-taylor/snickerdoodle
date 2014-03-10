(function (root, $) {
    var done = false;
    var videoList = [];
    var snicker = root.Snicker;
    $("div.clickable").click( function(){
            window.location = $(this).attr("url");
            return false;
    });
    
     $('body').on('click', '.img.floated', function () {
        var iconURL = $(this).attr("icon");
        console.log(iconURL);
        });

}(window, jQuery));

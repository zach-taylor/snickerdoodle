        function addVideo(SiteURL) {
        var done = false;
	var videoURL = SiteURL
        var videoSite;
        var videoID;
        videoSite = videoURL.split("/",3)[2];
	if (videoSite == "youtu.be") {
	   videoID = videoURL.split("/",4)[3];
	} else if (videoSite == "vimeo.com") {
	   videoID = videoURL.split("/",4)[3];
	}
        return videoID;
	}
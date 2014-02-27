        function addVideo(SiteURL) {
        var done = false;
	var videoURL = SiteURL
        var videoSite;
        var videoID;
        alert(videoURL.split(".",2)[1]);
	if (videoURL.split(".",2)[1] == "youtube") {
            videoSite = videoURL.split(".",2)[1];
            videoID = videoURL.split("=",2)[1];
	} else if (videoURL.split(".",2)[1] == "vimeo") {
            videoSite = videoURL.split(".",2)[1];
            videoID = videoURL.split("/",2)[1];
	}
        return videoID;
	}
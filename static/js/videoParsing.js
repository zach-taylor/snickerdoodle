        function addVideo(SiteURL) {
        var done = false;
	var videoURL = SiteURL
        var videoSite;
        var videoID;
	if (videoURL.split(".",2)[1] == "youtube") {
            videoSite = videoURL.split(".",2)[1];
            videoID = videoURL.split("=",2)[1];
	} else if (videoURL.split("/",4)[2] == "vimeo.com") {
            videoSite = videoURL.split("/",4)[2];
            videoID = videoURL.split("/",4)[3];
            alert(videoID);
	}
        return videoID;
	}
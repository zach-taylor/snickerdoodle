        function addVideo() {
        var done = false;
	var videoURL
        var videoSite;
        var videoID;
	var areYouDone;
	var i = 0;
	while(!done){
        videoURL = prompt("What is the video URL");
        videoSite = videoURL.split("/",3)[2];
	if (videoSite == "www.youtube.com") {
	   videoID = videoURL.split("=",2)[1];
	} else if (videoSite == "vimeo.com") {
	   videoID = videoURL.split("/",4)[3];
	}
	areYouDone = prompt("Are you done adding videos? y/n");
	if (areYouDone == "y") {
	    done = true;
	}else if(areYouDone == "n"){
	  done = false;
	}
	}
	}
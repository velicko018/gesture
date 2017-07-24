(function () {

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var video = document.getElementById('video'),
		vendorUrl = window.URL || window.webkitURL;

	navigator.getMedia = navigator.getUserMedia ||
						 navigator.webkitGetUserMedia ||
						 navigator.mozGetUserMedia ||
						 navigator.msGetUserMedia;

	navigator.getMedia({
		video:true,
		audio: false
	}, function(stream) {
		video.src = vendorUrl.createObjectURL(stream)
		video.play();
	}, function(error){

	});

	var ViewModel = function(){
        var self = this;
        var up = false;
        var left = false;
        var down = false;
        var right = false;

		self.takeAPhoto = ko.observable("Swing hand from left to right to take a photo!");
		self.timer = ko.observable("3!");
		self.editText = ko.observable("Swing down if you want to edit this photo.");

		gest.start();
		gest.options.subscribeWithCallback(function(gesture) {
            if (gesture.left) {
                left = true;
			}
            if (gesture.right) {
                right = true;
			}
            if (gesture.up) {
                up = true;
	    	}
            if (gesture.down) {
                down = true;	
            }

            if (up && down && left && right) {
                up = down = left = right = false;
                var sec = 3;
	     		var countDown = setInterval(function(){
	     			if(sec > 0)
	     				self.timer((sec--) + "!");
                    else
                        self.timer("say cheese!");
	     		}, 1000);
	     		setTimeout(function(){
	     			clearInterval(countDown);
	     			context.drawImage(video, 0, 0, 300,150);
	     			$('html, body').animate({
				         scrollTop: $("#canvas").offset().top
				     }, 2000);
	     		}, 4000)	
            }   
		});
	}
	ko.applyBindings(new ViewModel());
	
})();
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
        video: true,
        audio: false
    }, function (stream) {
        video.src = vendorUrl.createObjectURL(stream)
        video.play();
    }, function (error) {

    });

    var ViewModel = function () {
        var self = this;

        self.takeAPhoto = ko.observable("Shake hands to take a photo!");
        self.timer = ko.observable("5!");
        self.cheese = ko.observable("");
        var domen = "www.radomirovdomen.com";
        self.editText = ko.observable("You can download picture from " + domen + "/Gallery");

        self.captured = ko.observable(false);

        self.gestBuffer = ko.observableArray([]);

        var getsInterval;
        var lastNumberOfGests = 0;

        var pauseGestDetection = false;

        self.gestBuffer.subscribe(function (changes) {
            clearInterval(getsInterval);

            getsInterval = setInterval(function () {
                if (self.gestbuffer != null && (self.gestbuffer().length <= lastnumberofgests)) {
                    self.gestbuffer([]);
                   console.clear();
                }
            }, 3000);

            if (self.gestBuffer().length >= 6) {
                clearInterval(getsInterval);
                pauseGestDetection = true;
                self.triggerCapture();
                self.gestBuffer([]);
                lastNumberOfGests = 0;
            }
            lastNumberOfGests = self.gestBuffer().length;

        }, null, "arrayChange");

        gest.start();
        gest.options.subscribeWithCallback(function (gesture) {
            if (pauseGestDetection)
                return;
            console.log(gesture.direction);
            self.gestBuffer.push(gesture.direction);
        });

        self.triggerCapture = function () {
            var sec = 5;
            var countDown = setInterval(function () {
                if (sec > 0)
                    self.timer((sec--) + "!");
                else {
                    self.cheese("cheese!");
                    self.timer("");
                }
            }, 1000);
            
            setTimeout(function () {
                clearInterval(countDown);
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                var image = document.getElementById("canvas").toDataURL("image/png");
                image = image.replace('data:image/png;base64,', '');

                $.ajax({
                    method: "post",
                    url: "/Gallery/Upload",
                    data: { "imageString": image },
                    cache: false,
                    success: function (data) {
                        console.log("success");

                        context.clearRect(0, 0, canvas.width, canvas.height);

                        var responseImage = new Image();
                        responseImage.onload = function () {
                            context.drawImage(responseImage, 0, 0, canvas.width, canvas.height);
                        }
                        document.getElementById("image").src = data;
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });

                $('html, body').animate({
                    scrollTop: $("#image").offset().top
                }, 2000);


                setTimeout(function () {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 2000);
                    self.timer("5!");
                    self.cheese("");

                    pauseGestDetection = false;
                }, 10000);

            }, 6000);
        };
    };
    ko.applyBindings(new ViewModel());

})();
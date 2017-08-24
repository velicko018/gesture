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
        self.timer = ko.observable("3!");
        var domen = "www.radomirovdomen.com";
        self.editText = ko.observable("Shake again if you want to upload this photo to our gallery. You can download it laiter from " + domen + "/Gallery");

        self.captured = ko.observable(false);

        self.gestBuffer = ko.observableArray([]);
        self.acceptBuffer = ko.observableArray([]);

        var getsInterval, acceptInterval;
        var lastNumberOfGests = 0, lastNumberOfAccept = 0;

        var pauseGestDetection = false;

        self.gestBuffer.subscribe(function (changes) {
            clearInterval(getsInterval);
            getsInterval =  setInterval(function () {
                if (self.gestBuffer().length <= lastNumberOfGests) {
                    self.gestBuffer([]);
                    console.clear();
                }
            }, 3000);

            if (self.gestBuffer().length >= 6) {

                pauseGestDetection = true;
                self.triggerCapture();
                self.gestBuffer([]);
                lastNumberOfGests = 0;
                self.captured(true);
                pauseGestDetection = false;
            }
            lastNumberOfGests = self.gestBuffer().length;

        }, null, "arrayChange");
        self.acceptBuffer.subscribe(function (changes) {
            clearInterval(acceptInterval);
            acceptInterval = setInterval(function () {
                if (self.acceptBuffer().length <= lastNumberOfAccept) {
                    self.acceptBuffer([]);
                    console.clear();
                }
            }, 3000);

            if (self.acceptBuffer().length >= 6) {
                pauseGestDetection = true;
                self.save();
                self.acceptBuffer([]);
                lastNumberOfAccept = 0;
                self.captured(false);
                pauseGestDetection = false;
            }
            lastNumberOfAccept = self.acceptBuffer().length;
        }, null, "arrayChange");

        gest.start();
        gest.options.subscribeWithCallback(function (gesture) {
            if (pauseGestDetection)
                return;
            console.log(gesture.direction);
            if (self.captured())
                self.acceptBuffer.push(gesture.direction);
            else self.gestBuffer.push(gesture.direction);
        });

        self.triggerCapture = function () {
            var sec = 3;
            var countDown = setInterval(function () {
                if (sec > 0)
                    self.timer((sec--) + "!");
                else self.timer("say cheese!");
            }, 1000);
            
            setTimeout(function () {
                clearInterval(countDown);
                context.drawImage(video, 0, 0);

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
                            context.drawImage(responseImage, 0, 0);
                        }
                        responseImage.src = 'data:image/png;base64,' + data;
                    },
                    error: function (data)
                    {
                        console.log(data);
                    }
                });
                
                $('html, body').animate({
                    scrollTop: $("#canvas").offset().top
                }, 2000);
            }, 4000)
        };
        self.save = function () {

            $.ajax({
                method: "post",
                url: "/Gallery/Save",
                success: function (data) {
                    console.log(data);
                },
                error: function (data) {
                    console.log("save ajax req failed to send.");
                }
            });

            context.clearRect(0, 0, canvas.width, canvas.height);

            $('html, body').animate({
                scrollTop: window.top
            }, 2000);
        };
    };
    ko.applyBindings(new ViewModel());

})();
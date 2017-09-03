
    var Gallery = function ()
    {
        var self = this;

        self.title = ko.observable("Gesture Selfie");

        self.Photos = ko.observableArray([]);
        self.startIndex = ko.observable(0);
        self.endIndex = ko.observable(6);

        self.load = function () {
            console.log("uso u funkciju!");
            $.ajax({
                method: "get",
                url: "/Gallery/LazyLoad",
                data: { "startIndex": self.startIndex(), "endIndex": self.endIndex() },
                cache: true,
                success: function (data) {

                    self.Photos(self.Photos().concat(data));

                    console.log(self.Photos());
                    self.startIndex(self.startIndex() + 6);
                    self.endIndex(self.endIndex() + 6);
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
        $(window).on('scroll', function () {
            if ($(window).scrollTop() > $(document).height() - $(window).height()) {
                //self.load();
            }
        }).scroll();
        $(document).ready(function () {
            self.load();
        });
    }


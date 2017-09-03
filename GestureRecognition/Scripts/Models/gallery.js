
    var Gallery = function ()
    {
        var self = this;

        self.title = ko.observable("Gesture Selfie");

        self.Photos = ko.observableArray([]);
        console.log(self.Photos);
        self.startIndex = ko.observable(0);
        self.endIndex = ko.observable(6);


        var nomore = false;

        var loadInProgress = false;

        self.load = function () {
            loadInProgress = true;
            $.ajax({
                method: "get",
                url: "/Gallery/LazyLoad",
                data: { "startIndex": self.startIndex(), "endIndex": self.endIndex() },
                cache: false,
                success: function (data) {
                    if (data == "No more photos") {
                        nomore = true;
                        return;
                    }
                    console.log(data.length);
                    self.Photos(self.Photos().concat(data));
                },
                error: function (data) {
                    console.log(data);
                }
            });
            setTimeout(function () {
                loadInProgress = false;
            }, 2000);
        }
        $(window).on('scroll', function () {
            if (loadInProgress) return;
            if (nomore) return;
            if ($(window).scrollTop() >= $(window).height() * 0.7) {

                self.startIndex(self.startIndex() + 6);
                self.endIndex(self.endIndex() + 6);

                self.load();
            }
        }).scroll();

        $(document).ready(function () {
            window.scrollTo(0, 0);
            self.load();
        });
    }


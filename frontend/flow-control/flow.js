var flow = new Flow();


cmp({

    events: {
        'click .btn-group .btn-play':  function () {
            this.video.play();
        },

        'click .video-btn': function (e) {
            var btn = e.target;
            this.trigger(btn.value);
        },

        'click .btn-submit': function () {
            flow.trigger("beforesubmit");
            net.get('/submit', function (res) {
                flow.trigger("submit", res);
            });
        }
    },


    init: function () {
        this.video = new Video();
        this.video.on("ended", function () {
            this.video.hide();
            this.showButtons();
        });
        flow.any([
            "choice-a",
            "choice-b",
            "choice-c",
            "choice-d"
        ], function () {
            this.showSubmitButton();
        })
        .when("submit", function (res) {
            if (res.right) {
                this.point++;
                this.trigger("pointChange", this.point);
                this.jumpTo(res.next);//跳到下一段视频
            }
        })
        .when("username", function (username) {
            this.showUserName(); //显示用户名
            this.getUserPoints(username); //请求用户分数
        })
        .when("pointChange", this.updatePoints.bind(this));

        this.getUserName();
    },

    showButtons: function () {
        //显示视频按钮
    },

    showSubmitButton: function () {
        //显示提交按钮
    },

    jumpTo: function () {
        //跳转到一段视频中
    },

    getUserPoints: function (username) {
        net.get('/userPoints', {username: username}, function (points) {
            flow.trigger("pointChange", points);
        });
    },

    updatePoints: function (points) {
        this.showPoints(points); //展示用户分数
    }
})
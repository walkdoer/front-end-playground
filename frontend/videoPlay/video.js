(function (window, undefined) {
    'use strict';

    var VideoPlayer = function (selector, options) {
        this.video = document.querySelector(selector);
    };

    VideoPlayer.prototype.play = function() {
        this.video.play();
    };

    VideoPlayer.prototype.pause = function() {
        this.video.pause();
    };

    window.VideoPlayer = VideoPlayer;

})(window);
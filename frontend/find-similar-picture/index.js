var sim = window.sim;


var imgG11 = document.getElementById('g11');
var imgG12 = document.getElementById('g12');

var imgG21 = document.getElementById('g21');
var imgG22 = document.getElementById('g22');




waitImgLoaded([imgG11, imgG12], function () {
    document.getElementById('result-1').innerHTML =  sim.isSimilar(imgG11, imgG12);
});

waitImgLoaded([imgG21, imgG22], function () {
    document.getElementById('result-2').innerHTML =  sim.isSimilar(imgG21, imgG22);
});



function waitImgLoaded(imgs, cb) {
    var count = imgs.length;
    var loadedCount = 0;
    function isFinish() {
        if (loadedCount === count) {
            return true;
        }
    }
    imgs.forEach(function (img) {
        img.onload = function () {
            loadedCount++;
            if (isFinish()) {
                cb();
            }
        }
    });
}
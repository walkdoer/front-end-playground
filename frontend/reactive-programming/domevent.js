function $(s) {
    return document.querySelector(s);
}

var $input = $('#input');

var keyups = Rx.Observable.fromEvent($input, 'keyup')
    .pluck('target', 'value')
    .filter(function (text) {
        return text.length > 2;
    });

keyups.subscribe(function (str) {
    console.log('keyups:' + str);
});


var debounced = keyups.debounce(500);

debounced.subscribe(function (str) {
    console.log('debounced:' + str);
});


var $clickBtn = $('#clickBtn');

var click = Rx.Observable.fromEvent($clickBtn, 'click')
            .pluck('target');

click.subscribe(function (e) {
    console.log(e);
});


var mousemove = Rx.Observable.fromEvent($('body'), 'mousemove');
var $result = $('#result');

var subMousemove = mousemove.subscribe(function (e) {
    $result.innerHTML = e.clientX + ', ' + e.clientY;
});

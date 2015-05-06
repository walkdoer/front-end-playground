!function(window) {


    /** 例子1 */
    var up = $("#up").asEventStream("click");
    var down = $("#down").asEventStream("click");


    var counter = up.map(1).merge(down.map(-1))
                    .scan(0, function (x, y) {
                        return x + y;
                    });
    counter.assign($('#text'), 'text');
}(window);
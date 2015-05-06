!function(window) {
    //参考： https://baconjs.github.io/tutorials.html

    /** 例子1 */
    var up = $("#up").asEventStream("click");
    var down = $("#down").asEventStream("click");


    var counter = up.map(1).merge(down.map(-1))
                    .scan(0, function (x, y) {
                        return x + y;
                    });
    counter.assign($('#text'), 'text');





    /** 例子2 */

    function textFieldValue(field) {
        function getValue() {
            return $(field).val();
        }
        return field.asEventStream('keyup').map(getValue).toProperty(getValue());
    }
    var username = textFieldValue($('#username'));
    var age = textFieldValue($('#age'));

    username.log();
    age.log();

    var usernameEntered = username.map(nonEmpty);
    var ageEntered = age.map(nonEmpty);
    function nonEmpty (x) { return x.length > 0;}

    function and(a,b) { return a && b;}

/*    buttonEnabled.onValue(function (enabled) {
        $('button#confirm').attr('disabled', !enabled);
    });*/

    /** 可以将上面这一段简化*/
    var $confirmBtn = $('button#confirm')


    var availabilityRequest = username.changes().map(function (user) {
        return {url: '/usernameAvailable/' + user};
    });
    /*
    使用flatMapLatest 的原因是保证使用最后的发出请求的那个查询结果
    */
    var availabilityResponse = availabilityRequest.flatMapLatest(function (val) {
        return Bacon.fromPromise(ajax(val.url));
    });

    function ajax() {
        var deferred = Q.defer();
        setTimeout(function () {
            deferred.resolve(Math.random() * 2 > 1.5);
        }, 100);
        return deferred.promise;
    }

    usernameAvailable = availabilityResponse.toProperty(true);
    usernameAvailable.log();

    usernameAvailable.not().onValue($confirmBtn, 'attr', 'disabled');

    var buttonEnabled = usernameEntered.and(ageEntered).and(usernameAvailable);
    buttonEnabled.not().onValue($confirmBtn, 'attr', 'disabled');

}(window);
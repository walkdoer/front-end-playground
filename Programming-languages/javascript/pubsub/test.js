var PS = require('./pubsub');

var handler_a = function (msg, name, info) {
        console.log('hello ' + name + ',you are a' + info);
    },
    handler_b = function (msg, name, info) {
        console.log('there is a people coming in ,he is ' + name + ',' + info);
    };

PS.subscribe('people come in', handler_a);

PS.subscribe('people come in', handler_b);


PS.publish('people come in', 'jim', 'young man');


PS.unsubscribe('people come in', handler_b);


PS.publish('people come in', 'lucy', 'beauty');

PS.unsubscribe('people come in');
PS.publish('people come in', 'Tim', 'teacher');

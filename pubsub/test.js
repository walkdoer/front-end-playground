var PS = require('./pubsub');


PS.subscribe('people come in', function (name, info) {
    console.log('hello ' + name + ',' + info);
});


PS.publish('people come in', 'jim', 'a young man');
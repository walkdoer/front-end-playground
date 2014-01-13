/**
 * test when.js
 */
'use strict';
var when = require('./when'),
    http = require('http');


function request(url) {
    var deferred = when.defer();
    var req = http.get(url, function (res) {

        var bodyChunks= [];
        res.on('data', function (data) {
            bodyChunks.push(data);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);
            deferred.resolve(body);
        });
    });

    req.on('error', function (err) {
        console.log('Error', err.message);
        deferred.reject(err);
    });
    return deferred.promise;
}

request('http://www.baidu.com').then(function(data) {
    console.log('load data successful');
}, function (err) {
    console.error('load data fail');
});

function loadImages(urlArray) {
    var deferreds = [];

    for (var i=0; i < urlArray.length; i++) {
        deferreds.push(request(urlArray[i]));
    }
    return when.all(deferreds);
}

var imageArray = [
    'http://www.baidu.com/favicon.ico',
    'http://www.google.com/favicon.ico'
];

loadImages(imageArray).then(function (dataArray) {
    console.log('load ' + dataArray.length + ' image success');
}, function () {
    console.error('load images fail');
}).then(function () {
    console.log('is there two Images');
});

/**
 * 模拟异步请求数据
 */
var number = 0,
    count = 0;
function asyncGetNumber () {
    var deferred = when.defer();
    setTimeout (function () {
        deferred.resolve(number++);
    }, count++ * 1000);
    return deferred.promise;
}
function asyncGetNumberArray(len) {
    var deferreds = [];
    while (len--) {
        deferreds.push(asyncGetNumber());
    }
    return deferreds;
}

when.map(asyncGetNumberArray(5), function(number) {
    console.log(number);
});



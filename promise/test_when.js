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
function loadImageError() {
    console.error('load images fail');
}
function loadImageSuccess(dataArray) {
    console.log('load ' + dataArray.length + ' image success');
}

loadImages(imageArray).then(loadImageSuccess, loadImageError);

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
//when.map的第一种用法：传入Promise数组
when.map(asyncGetNumberArray(5), function(number) {
    console.log(number);
});
//when.map的第二种用法：传入Value数组
when.map(imageArray, request).then(loadImageSuccess, loadImageError);

when.reduce(asyncGetNumberArray(5), function (currentResult, value, index, total){
    console.log(currentResult, value, index, total);
    return currentResult + value;
}).then(function (total) {
    console.log('total:' + total);
});


'use strict';

var fs = require('fs'),
    when = require('./when'),
    ping = require('./my-ping'),
    http = require('http');


function get(url) {
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
        deferred.reject(err);
    });
    return deferred.promise;
}

function getTestIpList () {
    return get('http://12306.uodoo.com/cw/ps').then(function (result) {
        result = JSON.parse(result);
        var resultObj = result.object,
            ipList = resultObj.poolIp['1'];
        return ipList;
    }, function () {
        console.log('get test IP list fail!');
    });
}

function getIPDetail(ip) {
    console.log('IP ADDR: ' + ip);
    return get('http://ip.taobao.com/service/getIpInfo.php?ip=' + ip);
}

function isGoodIP(ipInfo) {
    if (ipInfo.isp === '电信' && !~['北京市', '广东省', '上海市'].indexOf(ipInfo.region)) {
        return true;
    }
    return false;
}

function pingIp (ipInfo) {

    console.log('正在检测' + ipInfo.region + ipInfo.isp + 'CDN: ' + ipInfo.ip);
    return when.promise(function (resolve, reject, notify) {
        ping.probe(ipInfo.ip, function (pingResult) {
            pingResult.source = ipInfo;
            resolve(pingResult);
        });
    });
}
getTestIpList().then(function (ipList) {
    var bestIP = null,
        minSpeed = Number.MAX_VALUE;
    //处理IP数组

    //并行获取所有IP详细数据
    var promises = ipList.map(getIPDetail);
    return promises.reduce(function (sequence, ipPromise) {
        return sequence.then(function () {
            return ipPromise;
        }).then(function (result) {
            var ipInfo = JSON.parse(result).data;
            return ipInfo;
        }).then(pingIp).then(function (pingResult){
            console.log(pingResult);
            if (pingResult.avg < minSpeed) {
                minSpeed = pingResult.avg;
                bestIP = pingResult.source;
            }
        });
    }, when.resolve()).then(function () {
        return bestIP;
    });
}).then(function (bestIp) {
    console.log('bestIp:', bestIp);
});



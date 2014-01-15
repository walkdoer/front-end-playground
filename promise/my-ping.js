/* ========================================================================
 * : my-ping.js  v0.0.0
 * ping
 * ========================================================================
 * Copyright 
 * Licensed under MIT
 * ======================================================================== */
'use strict';
var sys = require('sys'),
    exec = require('child_process').exec;


exports.probe = function (host, callback) {
    exec('ping -c 3 ' +  host, function (error, stdout, stderr) { 
        // console.log(typeof stdout);
        if (error) {
            throw error;
        }
        // sys.puts(stdout);
        var regexp =  /round-trip min\/avg\/max\/stddev\s*=\s*(\d+\.\d+)\/(\d+\.\d+)\/(\d+\.\d+)\/(\d+\.\d+)/;
        var infoArray = regexp.exec(stdout);
        // console.log(stdout);
        if (typeof callback === 'function') {
            callback({
                min: parseFloat(infoArray[1]),
                avg: parseFloat(infoArray[2]),
                max: parseFloat(infoArray[3]),
                stddev: parseFloat(infoArray[4])
            });
        }
    });
};

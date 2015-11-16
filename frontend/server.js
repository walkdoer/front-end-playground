'use strict';

var path = require('path');
var express = require('express');
var app = express();

var staticDir = path.resolve(__dirname);
app.use(express.static(staticDir));

var port = process.argv[2] || 5000;
port = parseInt(port, 10);

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});

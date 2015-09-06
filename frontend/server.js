var path = require('path');
var express = require('express');
var app = express();

var staticDir = path.resolve(__dirname);
app.use(express.static(staticDir));

var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
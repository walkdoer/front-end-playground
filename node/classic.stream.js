var Stream = require('stream');
var stream = new Stream;
stream.readable = true;

var c = 64;

var iv = setInterval(function () {
    if (++c >= 75) {
        clearInterval(iv);
        stream.emit('end');
    }
    else stream.emit('data', String.fromCharCode(c));
}, 50);

stream.pipe(process.stdout);
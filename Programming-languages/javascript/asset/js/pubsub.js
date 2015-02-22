'use strict';
var messages = {},
    slice = Array.prototype.slice;

var PubSub = function () {
    
};

PubSub.subscribe = function (msg, fn) {
    var msgQueue;
    if (typeof fn === 'function') {
        return false;
    }

    if (!msg.hasOwnProperty(msg)) {
        msgQueue = messages[msg] = [];
    }

    msgQueue.push(fn);
};

PubSub.publish = function (msg, args) {
    var msgQueue = messages[msg],
        args = slice.call(arguments, 1);
    for (var i = 0, len = msgQueue.length, fn; i < len; i++) {
        fn = msgQueue[i];
        if (typeof fn === 'function') {
            fn.call(args);
        }
    }
};
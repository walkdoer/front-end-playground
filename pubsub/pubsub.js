'use strict';
var messages = {},
    slice = Array.prototype.slice;


function hasMessage(msg) {
    return messages.hasOwnProperty(msg);
}
var PubSub = function () {
    
};
PubSub.subscribe = function (msg, fn) {
    var msgQueue;
    if (typeof fn !== 'function') {
        return false;
    }

    if (!hasMessage(msg)) {
        messages[msg] = [];
    }

    messages[msg].push(fn);
};

PubSub.publish = function (msg) {
    if (!hasMessage(msg)) {
        return false;
    }
    var msgQueue = messages[msg],
        args = slice.call(arguments, 0);
    for (var i = 0, len = msgQueue.length, fn; i < len; i++) {
        fn = msgQueue[i];
        if (typeof fn === 'function') {
            fn.apply(null, args);
        }
    }
};

PubSub.unsubscribe = function (msg, fn) {

    if (!hasMessage(msg)) {
        return false;
    }

    var msgQueue = messages[msg];
    if (typeof fn === 'function') {
        for (var i = 0, len = msgQueue.length, fnItm; i < len; i++) {
            fnItm = msgQueue[i];
            if (fnItm === fn) {
                msgQueue.splice(i, 1);
            }
        }
    } else {
        messages[msg] = null;
        delete messages[msg];
    }
};
module.exports = PubSub;
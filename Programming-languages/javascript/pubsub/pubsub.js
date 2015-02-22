'use strict';
var messages = {},
    lastId = -1,
    slice = Array.prototype.slice;
function hasMessage(msg) {
    return messages.hasOwnProperty(msg);
}
var PubSub = function () {
	//todo
};
PubSub.subscribe = function (msg, fn) {
    if (typeof fn !== 'function') {
        return false;
    }
    var token = ++lastId;

    if (!hasMessage(msg)) {
        messages[msg] = [];
    }

    messages[msg].push({
        token: token,
        fn: fn
    });
};

PubSub.publish = function (msg) {
    if (!hasMessage(msg)) {
        return false;
    }
    var subscribers = messages[msg],
        args = slice.call(arguments, 0);
    for (var i = 0, len = subscribers.length, fn; i < len; i++) {
        fn = subscribers[i].fn;
        if (typeof fn === 'function') {
            fn.apply(null, args);
        }
    }
};

PubSub.unsubscribe = function (tokenOrMsg, fn) {
    var token, msg;
    if (typeof tokenOrMsg === 'number') {
        token = tokenOrMsg;
    } else if (typeof tokenOrMsg === 'string') {
        msg = tokenOrMsg;
    } else {
        return false;
    }
    if (msg && !hasMessage(msg)) {
        return false;
    }
    var subscribers = messages[msg];
    if (typeof fn === 'function') {
        for (var i = 0, len = subscribers.length, subscriber; i < len; i++) {
            subscriber = subscribers[i];
            if (subscriber.fn === fn) {
                subscribers.splice(i, 1);
            }
        }
    } else {
        messages[msg] = null;
        delete messages[msg];
    }
};
module.exports = PubSub;

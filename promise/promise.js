'use strict';
var Promise = function () {
    this.handlerQueue = [];
}

Promise.prototype.resolve = function (data) {
    for (var i=0; i < handlerQueue.length; i++) {
        var handler = handlerQueue[i];
        if (typeof handler === 'function') {
            data = handler(data);
        }
    }
};

Promise.prototype.then = function (handler) {
    this.handlerQueue.push(handler);
};

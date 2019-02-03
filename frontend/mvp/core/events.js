class Events {
  constructor() {
    this.listenerMap = {};
  }

  on(evt, sub) {
    let listeners = this.listenerMap[evt];
    if (!listeners) {
      listeners = this.listenerMap[evt] = [];
    }
    const existSub = listeners.find(val => val.exp === sub.exp);
    if (!existSub) {
      listeners.push(sub);
    }
  }

  notify(evt, data) {
    let listeners = this.listenerMap[evt]
    if (listeners) {
      listeners = listeners.slice();
    } else {
      return;
    }
    for (let i = 0; i < listeners.length; i++) {
      listeners[i](data);
    }
  }
}
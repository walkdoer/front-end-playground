(function (name, context, deps, definition, i) {
    if (typeof module != 'undefined' && module.exports){
        for(i=0; i<deps.length;i++){deps[i] = require[deps[i]] || null;}
        module.exports = definition.apply(context,deps);
    }
    else if (typeof define == 'function' && define.amd){
        define(deps,definition);
    }
    else{
        for(i=0; i<deps.length;i++){deps[i] = context[deps[i]] || null;}
        context[name] = definition.apply(context,deps);
    }
})('Evt', this, [], function(){

    var slice = Array.prototype.slice;
    var un = void 0;
    var methods = [
        function on(){
            var evts, args, e = (args = slice.call(arguments)).shift();
            if(typeof e == 'function'){
                args.unshift(e);
                e = '*';
            }
            (evts = ((this._events = this._events || {})[e] = this._events[e]   || [])).push.apply(evts,args);
            return this;
        }
    ,   function off(e, fn){
            var evts = (this._events = this._events || {});
            if(!(e in evts)){return;}
            evts[e].splice(evts[e].indexOf(fn),1);
            return this;
        }
    ,   function trigger(event /* , args... */){
            var evts = (this._events = this._events || {})[(typeof event !== 'string')? event.type : event] || null
            ,   l = evts? evts.length : 0
            ,   args = l ? slice.call(arguments) : un
            ,   i = 0
            ;
            if(!l){return false;}
            for(i;i<l;i++){
                evts[i].apply(this,args);
            }
            if(event != '*' && (evts = this._events['*']) && (l = evts.length)){
                for(i=0;i<l;i++){
                    evts[i].apply(this,args);
                }
            }
            return this;
        }
    ];

    var styles = {
        'eventEmitter':['bind','unbind','trigger']
    ,   'dom':['addEventListener','removeEventListener','dispatchEvent']
    ,   'js':['on','off','trigger']
    }

    var mixin = function(obj,onPrototype,style){
        obj = obj || {};
        if((typeof onPrototype !== 'boolean')){style = onPrototype; onPrototype = false;}
        var i=0, fns = styles[style || mixin.style];
        var o = onPrototype? obj.prototype : obj;
        for(i;i<3;i++){
            o[fns[i]] = o[fns[i]] || methods[i];
        }
        return obj;
    }

    mixin.style = 'js';
    mixin.styles = styles;
    mixin.DOM = 'dom';
    mixin.EVENT_EMITTER = 'eventEmitter';
    mixin.NODE = 'eventEmitter';
    mixin.JS = 'js';
    mixin.SIMPLE = 'js';
    return mixin;


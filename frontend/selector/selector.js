    var class2type = {};
    var slice = Array.prototype.slice;
    var isArray = Array.isArray || function(object){ return object instanceof Array; }
    "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name, i) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });

    var $ = function(selector, context) {
        var isID = selector.indexOf('#') === 0;
        var found;
        context = context || doc;
        var dom = isID ?
            ((found = context.querySelector(selector)) ?
                [found] : []) :
            slice.call(context.querySelectorAll(selector));
        return init(dom);
    }

    $.fn = {
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,
        map: emptyArray.map,
        hide: function () {
            this.style.display = 'none';
        },

        show: function () {
            this.style.display = 'block';
        },

        html: function () {
            return this.innerHTML;
        },

        find: function (selector) {
            return this.length === 1 ?
                $(selector, dom[0]) :
                this.map(function (dom) { return $(selector, dom); });
        }
    };

    $.extend = function(target){
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        args.forEach(function(arg){
            extend(target, arg, deep);
        })
        return target;
    };
    $.createElement = function (str) {
        var dom = document.createElement(str);
        return init(dom);
    };

    function init(dom) {
        dom.__proto__ = $.fn;
    }

    function type(obj) {
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
    }
    function isObject(obj){
        return type(obj) == "object";
    }

    function isWindow(obj){
        return obj != null && obj == obj.window;
    }

    function isObject(obj) {
        return type(obj) == "object";
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }


    function extend(target, source, deep) {
        for (var key in source) {
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])){
                  target[key] = {};
                }
                if (isArray(source[key]) && !isArray(target[key])){
                  target[key] = []
                }
                extend(target[key], source[key], deep);
            }
            else if (source[key] !== undefined) {
                target[key] = source[key];
            }
        }
    }

    return $;
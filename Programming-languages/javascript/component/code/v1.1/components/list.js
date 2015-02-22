/**
 * components/List
 */
define(function () {
    'use strict';

    var h = require('h');
    var Component = require('./Com');
    var List = Component.extend({

        init: function () {
            this.list = [];
            this.$el = h('ul');
        },


        add: function (element) {
            this.list.push(element);
            this.$el.append(element.$el);
        },


        set: function (index, element) {
            this.list.splice(index, 1, element);
            this.$el.eq(index).replace(element.$el);
        }

    });

    return List;
});



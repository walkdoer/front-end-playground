define(function () {
    'use strict';

    var Component = require('./Com');
    var tpl = require('tpl/toolbar'),
        router = require('router');
    var Toolbar = Component.extend({

        components: [{
            type: 'button',
            id: 'back'
        }, {
            type: 'configWindow'
        }, {
            type: 'navigation'
        }, {
            type: 'button',
            id: 'config'
        }, {
            type: 'button',
            id: 'nav'
        }],

        render: function () {
            var $el = $(_.template(tpl, {}));
            this.$el = $el;
        },


        listeners: {
            'button:back:click': function () {
                router.back();
            },


            'button:config:click': function() {
                this.getChildById('config').show();
            },


            'button:nav:click': function () {
                this.getChildById('nav').show();
            }
        }

    });
    return Toolbar;
});

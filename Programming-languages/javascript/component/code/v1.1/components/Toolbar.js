define(function () {
    'use strict';

    var Component = require('./Com'),
        ConfigWindow = require('components/Window.Config'),
        Navigation = require('components/Navigation');
    var tpl = require('tpl/toolbar'),
        router = require('router');
    var Toolbar = Component.extend({

        render: function () {
            var $el = $(_.template(tpl, {}));
            this.$el = $el;
        },


        listeners: {
            'click .js-back': function () {
                router.back();
            },


            'click .js-config': function() {
                var cfgWin = this.cfgWin || new ConfigWindow().render();
                if (!this.cfgWin) {
                    this.$el.append(cfgWin);
                    this.cfgWin = cfgWin;
                } else {
                    cfgWin.show();
                }
            },


            'click .js-openNavigation': function () {
                var nav = this.nav || new Navigation().render();
                if (!this.nav) {
                    this.$el.append(nav);
                    this.nav = nav;
                } else {
                    nav.show();
                }
            }
        }

    });
    return Toolbar;
});

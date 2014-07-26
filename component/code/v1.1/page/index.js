/**
 * index page
 */
define(function() {

    'use strict';
    var Base = require('./base'),
        Navigation = require('components/Navigation'),
        ConfigWindow = require('components/Window.Config');
    var model = require('model');
    var pageTpl = require('/tpl/page/index'),
        adTpl = require('tpl/advertisement.tpl');


    var Index = Base.extend({

        render: function(data) {
            var $el = _.template(pageTpl, data);
            $('#container').append($el);
            this._renderAdvertisement();
        },

        uiEvents: {

            'click .js-config': function() {
                var cfgWin = this.cfgWin || new ConfigWindow().render();
                if (!this.cfgWin) {
                    this.$el.append(cfgWin);
                    this.cfgWin = cfgWin;
                } else {
                    cfgWin.show();
                }
            },


            'click .js-open-nav': function() {
                //open navigation dropmenu
                var nav = this.nav || new Navigation().render();
                if (!this.nav) {
                    this.$el.append(nav);
                    this.nav = nav;
                } else {
                    nav.show();
                }
            }
        },

        _renderAdvertisement: function() {
            var that = this;
            var date = new Date();
            model.getAdvertisement(date).then(function(ad) {
                var adHTML = _.template(adTpl, ad);
                that.$el.find('.advertisement').append(adHTML);
            });
        }

    });

    return Index;
});

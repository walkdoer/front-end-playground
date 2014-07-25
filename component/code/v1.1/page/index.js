/**
 * index page
 */
define(function() {

    'use strict';
    var Base = require('./base');
    var model = require('model');
    var pageTpl = require('/tpl/page/index'),
        adTpl = require('tpl/advertisement.tpl');


    var Index = Base.extend({

        render: function(data) {
            var $el = _.template(pageTpl, data);
            $('#container').append($el);
            this._renderAdvertisement();
            this._bindEvent();
        },


        uiEvents: {

            'click .js-config': function() {
                //open config window
            },


            'click .js-open-nav': function() {
                //open navigation
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

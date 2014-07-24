/**
 * index page
 */
define(function () {

    'use strict';
    var model = require('model');
    var pageTpl = require('/path/to/pageTpl'),
        adTpl = require('tpl/advertisement.tpl');
    var index = {

        render: function (data) {
            var $el = _.template(pageTpl, data);
            $('#container').append($el);
            this._renderAdvertisement();
            this._bindEvent();
        },


        _bindEvent: function () {
            this.$el.on('click', {

                '.js-config': function () {
                    //open config window
                },


                '.js-open-nav': function () {
                    //open navigation
                }

            });
        },

        _renderAdvertisement: function () {
            var that = this;
            var date = new Date();
            model.getAdvertisement(date).then(function (ad) {
                var adHTML = _.template(adTpl, ad);
                that.$el.find('.advertisement').append(adHTML);
            });
        }

    };

    return index;
});

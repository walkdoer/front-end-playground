/**
 * index page
 */
define(function() {

    'use strict';
    var Component = require('./Com'),
        Toolbar = require('components/Toolbar'),
        Adervertisement = require('components/Adervertisement');
    var model = require('model');
    var pageTpl = require('/tpl/page/index');


    var Index = Component.extend({

        render: function(data) {
            var $el = _.template(pageTpl, data);
            $('#container').append($el);
            this._renderToolbar();
            this._renderAdvertisement();
        },

        _renderAdvertisement: function() {
            var that = this;
            var date = new Date();
            model.getAdvertisement(date).then(function(adData) {
                that.ad = new Adervertisement(adData);
                that.$el.find('.advertisement').append(that.ad.render().$el);
            });
        },



        _renderToolbar: function() {
            this.toolbar = new Toolbar();
            this.$el.find('.toolbar').append(this.toolbar.render().$el);
        }

    });

    return Index;
});

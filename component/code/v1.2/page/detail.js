/**
 * detail page
 */
define(function() {

    'use strict';
    //页面的基本模块
    var Component = require('./Com');
    var index = Component.extend({

        components: [{
            type: 'toolbar'
        }, {
            type: 'newsDetail'
        }],

        uiEvents: {

            'click .js-close': function() {
                //close news
            },


            'click .js-next': function() {
                //view next news
            },


            'click .js-prev': function() {
                //view prev news
            }
        }
    });

    return index;
});

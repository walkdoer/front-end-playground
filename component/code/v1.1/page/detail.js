/**
 * detail page
 */
define(function() {

    'use strict';
    //页面的基本模块
    var Base = require('./base');
    var model = require('model');
    var pageTpl = require('/path/to/pageTpl');
    var index = Base.extend({

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
        },


        render: function(newsId) {
            model.getNews(newsId).then(function (news) {
                var $el = _.template(pageTpl, news);
                $('#container').append($el);
            });
        }

    });

    return index;
});

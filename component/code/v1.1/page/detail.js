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

            '.js-close': function() {
                //close article
            },


            '.js-next': function() {
                //view next news
            },


            '.js-prev': function() {
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

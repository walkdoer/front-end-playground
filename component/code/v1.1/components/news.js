/**
 * 新闻实体
 *
 * @return
 */
define(function () {
    'use strict';

    var Base = require('./base');
    var newsTpl = require('tpl/news');
    var News = Base.extend({

        render: function (news) {
            var $el = $(_.template(newsTpl, news));
            this.$el = $el;
        }

    });
    return News;
});

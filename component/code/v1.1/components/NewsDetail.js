/**
 * 新闻实体
 * components/NewsDetail
 *
 * @return
 */
define(function () {
    'use strict';

    var Base = require('./base');
    var newsTpl = require('tpl/news');
    var NewsDetail = Base.extend({

        render: function (news) {
            var $el = $(_.template(newsTpl, news));
            this.$el = $el;
        }

    });
    return NewsDetail;
});

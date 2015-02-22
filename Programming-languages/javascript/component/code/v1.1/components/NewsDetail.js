/**
 * 新闻实体
 * components/NewsDetail
 *
 * @return
 */
define(function () {
    'use strict';

    var Component = require('Com');
    var newsTpl = require('tpl/news');
    var NewsDetail = Component.extend({

        render: function (news) {
            var $el = $(_.template(newsTpl, news));
            this.$el = $el;
        }

    });
    return NewsDetail;
});

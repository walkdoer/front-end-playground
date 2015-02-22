/**
 * 新闻实体
 * components/NewsDetail
 *
 * @return
 */
define(function () {
    'use strict';

    var Component = require('Com');
    var newsTpl = require('tpl/news'),
        model = require('model');
    var NewsDetail = Component.extend({

        render: function () {
            var that = this;
            model.getNews(this.newsId).then(function (news) {
                var $el = $(_.template(newsTpl, news));
                that.$el.append($el);
            });
            return this;
        }

    });
    return NewsDetail;
});

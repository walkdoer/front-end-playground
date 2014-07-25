/**
 * news page
 */
define(function() {

    'use strict';
    var Base = require('./base'),
        News = require('components/news');
    var router = require('router'),
        model = require('model');
    var pageTpl = require('tpl/newsPage.tpl');
    var NewsPage = Base.extend({

        uiEvents: {
            'click .js-openNews': function(e) {
                var id = $(e.target).attr('data-id');
                router.route('/news/' + id);
            },


            'click .js-loadMore': function() {
                var $list = this.$el.find('.az_com-newsList');
                model.getNews({
                    pageNum: this.pageNum++
                }).then(function(newsArr) {
                    _.each(newsArr, function(newsData) {
                        var news = new News().render(newsData);
                        $list.append(news.$el);
                    });
                });
            }
        },


        render: function(data) {
            var newsArr = data.newsArr;
            var $page = $(_.template(pageTpl, data));
            var $list = $page.find('.az_com-newsList');
            _.each(newsArr, function(newsData) {
                var news = new News().render(newsData);
                $list.append(news.$el);
            });
            this.$el = $page;
            return this;
        }

    });

    return NewsPage;

});

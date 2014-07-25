/**
 * news page
 */
define(function() {

    'use strict';
    var Base = require('./base'),
        List = require('./list'),
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
                var page = this;
                model.getNews({
                    pageNum: this.pageNum++
                }).then(function(newsArr) {
                    _.each(newsArr, function(newsData) {
                        var news = new News().render(newsData);
                        page.list.add(news);
                    });
                });
            }
        },


        render: function(data) {
            var page = this;
            var newsArr = data.newsArr;
            var $page = $(_.template(pageTpl, data));
            this.list = new List();
            var $listContainer = $page.find('.az_com-newsList');
            _.each(newsArr, function(newsData) {
                var news = new News().render(newsData);
                page.list.add(news);
            });
            $listContainer.append(page.list.$el);
            this.$el = $page;
            return this;
        }

    });

    return NewsPage;

});

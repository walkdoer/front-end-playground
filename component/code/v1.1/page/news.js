/**
 * news page
 */
define(function() {

    'use strict';
    var Component = require('./Com'),
        List = require('./list'),
        Toolbar = require('components/Toolbar'),
        NewsBrief = require('components/NewsBrief');
    var router = require('router'),
        model = require('model');
    var pageTpl = require('tpl/newsPage.tpl');
    var NewsPage = Component.extend({

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
                        //create a news and then render it
                        var news = new NewsBrief().render(newsData);
                        page.list.add(news);
                    });
                });
            }
        },


        render: function(data) {
            var page = this;
            this.$el = $(_.template(pageTpl, data));
            this._renderToolbar();
            model.getNews({groupId: this.groupId, pageNum: 0}).then(function (data) {
                var newsArr = data.newsArr;
                page.list = new List();
                var $listContainer = page.$el.find('.az_com-newsList');
                _.each(newsArr, function(newsData) {
                    var news = new NewsBrief().render(newsData);
                    page.list.add(news);
                });
                $listContainer.append(page.list.$el);
                return this;
            });
        },

        _renderToolbar: function() {
            this.toolbar = new Toolbar();
            this.$el.find('.toolbar').append(this.toolbar.render().$el);
        }

    });

    return NewsPage;

});

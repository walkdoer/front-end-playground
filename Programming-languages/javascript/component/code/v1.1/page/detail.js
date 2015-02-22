/**
 * detail page
 */
define(function() {

    'use strict';
    //页面的基本模块
    var Component = require('./Com'),
        NewsDetail = require('components/NewsDetail'),
        Toolbar = require('components/Toolbar');
    var model = require('model');
    var index = Component.extend({

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
            var that = this;
            this._renderToolbar();
            model.getNews(newsId).then(function (news) {
                that.newsDetail = new NewsDetail();
                that.$el.append(that.newsDetail.render(news).$el);
            });
        },


        _renderToolbar: function() {
            this.toolbar = new Toolbar();
            this.$el.find('.toolbar').append(this.toolbar.render().$el);
        }

    });

    return index;
});

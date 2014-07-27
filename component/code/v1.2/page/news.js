/**
 * news page
 */
define(function() {

    'use strict';
    var Component = require('./Com'),
        NewsBrief = require('components/NewsBrief');
    var router = require('router'),
        model = require('model');
    var NewsPage = Component.extend({

        components: [{
            type: 'toolbar'
        }, {
            type: 'list',
            id: 'list'
        }],

        init: function () {
            this._super();
            var list = this.getChildById('list').load();
            //load Data
            model.getNews({
                pageNum: this.pageNum++
            }).then(function(newsArr) {
                _.each(newsArr, function(newsData) {
                    //create a news and then render it
                    var news = new NewsBrief().render(newsData);
                    list.add(news);
                });
            });
        },
        uiEvents: {
            'click .js-openNews': function(e) {
                var id = $(e.target).attr('data-id');
                router.route('/news/' + id);
            },


            'click .js-loadMore': function() {
                //load more
            }
        },

    });

    return NewsPage;

});

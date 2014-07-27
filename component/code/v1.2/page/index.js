/**
 * index page
 */
define(function() {

    'use strict';
    var Component = require('./Com'),
        NewsBrief = require('components/NewsBrief');

    var model = require('model');


    var Index = Component.extend({
        components: [{
            type: 'toolbar'
        },{
            type: 'advertisement'
        }, {
            type: 'list',
            id: 'news'
        }, {
            type: 'list',
            id: 'sport'
        }, {
            type: 'footer'
        }],

        init: function (options) {
            this._super(options);
            var lists = this.getChildByType('list');
            _.each(lists, function (list) {
                model.getNews(list.id).then(function(newsArr) {
                    _.each(newsArr, function(newsData) {
                        //create a news and then render it
                        var news = new NewsBrief().render(newsData);
                        list.add(news);
                    });
                });
            });
        }
    });

    return Index;
});

/**
 * app
 */
define(function () {

    'use strict';
    var router = require('path/to/router'),
    var IndexPage = require('page/index'),
        NewsDetailPage = require('page/detail'),
        NewsPage = require('page/news');

    //页面缓存
    var pageCache = {};

    var Pages = {
        index: IndexPage,
        news: NewsPage,
        newsDetail: NewsDetailPage
    };

    router('/index', pageRender('index'));
    router('/news', pageRender('news'));
    router('/news/:id', pageRender('newsDetail'));

    function pageRender (pageName) {
        return function () {
            var page = pageCache[pageName];
            if (!page) {
                var Page = Pages[pageName];
                page = new Page();
                pageCache[pageName] = page;
            }
            page.render();
        };
    }

    router.start();
});



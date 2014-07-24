/**
 * app
 */
define(function () {

    'use strict';
    var router = require('path/to/router'),
        model = require('path/to/model');
    var indexPage = require('page/index'),
        detailPage = require('page/detail'),
        newsPage = require('page/news');

    router('/index', renderIndex);
    router('/news', renderNews);
    router('/news/:id', renderNewsDetail);

    function renderIndex () {
        indexPage.render();
    }


    function renderNews() {
        newsPage.render();
    }

    function renderNewsDetail(newsId) {
        detailPage.render(newsId);
    }

    router.start();
});



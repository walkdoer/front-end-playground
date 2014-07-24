/**
 * index page
 */
define(function () {

    'use strict';
    var pageTpl = require('/path/to/pageTpl');
    var index = {
        render: function (data) {
            var $el = _.template(pageTpl, data);
            $('#container').append($el);
        },

        update: function (data) {
            var $el = _.template(pageTpl, data);
            $('#container').empty().append($el);
        }
    };

    return index;

});

/**
 * news page
 */
define(function () {

    'use strict';
    var pageTpl = require('/path/to/pageTpl');
    var newsPage = {
        render: function (data) {
            var $el = _.template(pageTpl, data);
            $('#container').append($el);
        },

        update: function (data) {
            var $el = _.template(pageTpl, data);
            $('#container').empty().append($el);
        }
    };

    return newsPage;

});



/**
 * app
 */
define(function () {

    'use strict';
    var router = require('path/to/router');
    var indexPage = require('path/to/indexPage'),
        newsPage = require('path/to/newsPage');

    router('/index', renderIndex);
    router('/news', renderNews);

    function renderIndex () {
        indexPage.render();
    }


    function renderNews() {
        newsPage.render();
    }

    router.start();
});




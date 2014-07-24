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
        }
    };

    return newsPage;

});


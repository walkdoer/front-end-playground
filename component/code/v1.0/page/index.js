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
            this._bindEvent();
        },
        _bindEvent: function () {
            this.$el.on('click', {
                '.js-config': function () {},
                '.js-open-nav': function () {}
            });
        },

        /* a lots of code in here */
        _foo: function () {
            this.$el.on('click', '.js-open-window', function () {});
        }
    };

    return index;
});

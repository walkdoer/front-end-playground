/**
 * detail page
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

                '.js-close': function () {
                    //close article
                },


                '.js-next': function () {
                    //view next news
                },


                '.js-prev': function () {
                    //view prev news
                }

            });
        }

    };

    return index;
});

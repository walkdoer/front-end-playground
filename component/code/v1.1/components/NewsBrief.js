/**
 * 新闻简要
 * components/NewsBrief
 *
 * @return
 */
define(function () {
    'use strict';

    var Component = require('./Com');
    var newsTpl = require('tpl/news');
    var NewsBrief = Component.extend({

        render: function (news) {
            var $el = $(_.template(newsTpl, news));
            this.$el = $el;
        }

    });
    return NewsBrief;
});

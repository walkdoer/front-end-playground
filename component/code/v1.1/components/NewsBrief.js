/**
 * 新闻简要
 * components/NewsBrief
 *
 * @return
 */
define(function () {
    'use strict';

    var Base = require('./base');
    var newsTpl = require('tpl/news');
    var NewsBrief = Base.extend({

        render: function (news) {
            var $el = $(_.template(newsTpl, news));
            this.$el = $el;
        }

    });
    return NewsBrief;
});

define(function () {
    'use strict';

    var Com = require('./Com'),
        DropMenu = require('./DropMenu');

    return Com.extend({

        render: function (menuArr) {
            this.dropMenu = new DropMenu(menuArr);
            this.$el.append(this.dropMenu.render().$el);
        }
    });
});

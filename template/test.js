'use strict';
require('colors');
var template = require('./template');

var tpl = '<span><%=name%></span>\n<span><%=all%></span>';
var data = {name: 'andrew', lover: 'iris', all: function () { return this.name + ' love ' + this.lover;}};
var result = template.tmpl(tpl, data);

console.log('result:\n' + result.yellow);
console.log('------------Test Result------------');
if (result === '<span>andrew</span>\n<span>andrew love iris</span>') {
    console.log('test pass'.green);
} else {
    console.log('test failed'.red);
}

require('colors');
var template = require('./template');

var tpl = '<span><%=name%></span>\n<span>like <%=like%></span>';
var data = {name: 'andrew', like: 'iris'};
var result = template.tmpl(tpl, data);

console.log('result:\n' + result.yellow);
console.log('------------Test Result------------');
if (result === '<span>andrew</span>\n<span>like iris</span>') {
    console.log('test pass'.green);
} else {
    console.log('test failed'.red);
}

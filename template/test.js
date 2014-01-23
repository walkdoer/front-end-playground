var template = require('./template');

var tpl = '<span><%=data.name%></span>\n<span><%=("hello " + data.name)%></span>';

var result = template.tmpl(tpl, {name: 'andrew'});

console.log('result:\n' + result);
console.log('------------Test Result------------');
if (result === '<span>andrew</span>\n<span>hello andrew</span>') {
    console.log('test pass');
} else {
    console.log('test failed');
}

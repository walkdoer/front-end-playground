'use strict';
require('colors');
var template = require('./template');

//之所以要改造 template， 是为了让html模板变成一个纯粹描述性的东西
// 就如test中的代码
//
// 一般会是这样子写代码  <span><%(name + 'love' + lover)%></span>
// 但是这样子有个问题就是，模板就出现了业务逻辑，而不是单纯的读取对象的数据了
//
// 所以改写
// {
//    iLoveYou: function () {
//         return this.name + 'love' + this.lover;
//    }
// }
// 模板: <span><%iLoveYou%></span>
// 输出: <span>andrew love iris</span>
//
// 总之目的就是为了将js业务逻辑完全和HTML模板分离开来
var tpl = '<span><%name%></span>\n<span><%all%></span>';
var data = {
    name: 'andrew',
    lover: 'iris',
    all: function () {
        return this.name + ' love ' + this.lover;
    },
};
var result = template.tmpl(tpl, data);

console.log('result:\n' + result.yellow);
console.log('------------Test Result------------');
if (result === '<span>andrew</span>\n<span>andrew love iris</span>') {
    console.log('test pass'.green);
} else {
    console.log('test failed'.red);
}



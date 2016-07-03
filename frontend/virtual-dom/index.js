var snabbdom = require('snabbdom');
var qs = require('qs.js');

var patch = snabbdom.init([ // Init patch function with choosen modules
  require('snabbdom/modules/class'), // makes it easy to toggle classes
  require('snabbdom/modules/props'), // for setting properties on DOM elements
  require('snabbdom/modules/style'), // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners'), // attaches event listeners
]);

var someFn = function () { console.log('someFn')};
var anotherEventHandler = function () { console.log('anotherEventHandler'); };
var h = require('snabbdom/h'); // helper function for creating vnodes
var vnode = h('div#container.two.classes', {on: {click: someFn}}, [
  h('span', {style: {fontWeight: 'bold'}}, 'This is bold'),
  ' and this is just normal text',
  h('a', {props: {href: '/foo'}}, 'I\'ll take you places!')
]);


var container = document.getElementById('container');
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);
var newVnode = h('div#container.two.classes', {on: {click: anotherEventHandler}}, [
  h('span', {style: {fontWeight: 'normal', fontStyle: 'italic'}}, 'This is now italics'),
  ' and this is still just normal text',
  h('a', {props: {href: '/bar'}}, 'I\'ll take you places!'),
  h('num'),
]);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state

var $span = {
  dom: qs.seq(1000, [1,2,3,4,5,6])
       .toProperty( function () { return 0})
       .map(function (val) {
         return h('num', {style: {color: val % 2 === 0 ? 'green' : 'red'}}, val);
       })
       .scan(function ($span, node) {
         return patch($span, node);
       }, document.querySelector('#container num'))
}

run($span);


function run(driver) {
  driver.dom.onValue(function (v) {
    console.log(v);
  });
}

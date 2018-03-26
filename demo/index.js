const Drag = require('../dist/index.min');
const offset = require('zhf.offset');
const zeroWrap = document.querySelector('.zero-wrap');
const zero = zeroWrap.querySelector('.zero');
new Drag({
    item: '.zero',
    callback: {},
    config: {
        limitLeftMin: 0,
        limitLeftMax: zeroWrap.offsetWidth - zero.offsetWidth,
        limitTopMin: 0,
        limitTopMax: zeroWrap.offsetHeight - zero.offsetHeight,
    },
    data: {},
});
new Drag({
    item: '.wrap1 .item',
    callback: {},
    config: {
        direction: 'col',
    },
    data: {},
});
new Drag({
    item: '.wrap2 .item-drag',
    callback: {
        mouseDown: function (obj) {
            obj.dom.style.transition = '0s';
            obj.dom.parentNode.classList.add('active');
        },
        mouseMove: function (obj) {
            console.log(offset(obj.dom).left);
        },
        mouseUp: function (obj) {
            obj.dom.style.transition = '0.4s';
            obj.dom.style.left = '0';
            obj.dom.style.top = '0';
            obj.dom.parentNode.classList.remove('active');
        },
    },
    config: {},
    data: {},
});

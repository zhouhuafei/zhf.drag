const Drag = require('../dist/index.min');
const offset = require('zhf.offset');
const checkDomImpact = require('zhf.check-dom-impact'); // 检测dom碰撞
const itemAll = document.querySelectorAll('.wrap1 .item');
const itemLen = itemAll.length;
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
        isAdsorption: true,
    },
    data: {},
});
itemAll.forEach(function (item, i) {
    new Drag({
        item: item,
        callback: {},
        config: {
            limitTopMin: -i * item.offsetHeight,
            limitTopMax: (itemLen - 1 - i) * item.offsetHeight,
            direction: 'col',
        },
        data: {},
    });
});

new Drag({
    item: '.wrap2 .item-drag',
    callback: {
        mouseDown: function (obj) {
            obj.dom.style.transition = '0s';
            obj.dom.parentNode.classList.add('active');
        },
        mouseMove: function (obj) {
            const arr = [];
            itemAll.forEach(function (item) {
                if (checkDomImpact(obj.dom, item)) {
                    arr.push(item);
                }
            });
            // 碰撞之后检测距离谁最近
            if (arr.length) {
                console.log(arr);
            }
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

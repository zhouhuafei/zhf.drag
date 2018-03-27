const Drag = require('../dist/index.min');
const offset = require('zhf.offset');
const checkDomImpact = require('zhf.check-dom-impact'); // 检测dom碰撞
// zero
const zeroWrap = document.querySelector('.zero-wrap');
const zero = zeroWrap.querySelector('.zero');
new Drag({
    item: zero,
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

function setPositionWH() {
    const wrap1 = document.querySelector('.wrap1');
    const item1All = wrap1.querySelectorAll('.item');
    const wrap2 = document.querySelector('.wrap2');
    const item2All = wrap2.querySelectorAll('.item');
    const postionXY = [];
    item1All.forEach(function (item) {
        postionXY.push({left: item.offsetLeft, top: item.offsetTop});
    });
    item1All.forEach(function (item) {
        item.style.position = 'absolute';
        item.style.left = '';
        item.style.top = '';
    });
}

setPositionWH();

// wrap1 和 wrap2 拖拽
const wrap1 = document.querySelector('.wrap1');
const item1All = wrap1.querySelectorAll('.item');
const item1Len = item1All.length;
const wrap2 = document.querySelector('.wrap2');
const item2All = wrap2.querySelectorAll('.item');
const item2Len = item2All.length;
wrap1.insertBefore(item1All[1], item1All[0]);

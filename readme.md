# 拖拽
* commonjs规范
```
const Drag = require('zhf.drag');

// 案例一
const zeroWrap = document.querySelector('.zero-wrap');
const zero = zeroWrap.querySelector('.zero');
new Drag({
    item: zero,
    callback: {
        mouseDownBefore: function (obj) {
        },
        mouseDownAfter: function (obj) {
        },
        mouseMoveBefore: function (obj) {
        },
        mouseMoveAfter: function (obj) {
        },
        mouseUpBefore: function (obj) {
        },
        mouseUpAfter: function (obj) {
        },
    },
    config: {
        hasIconMove: true, // 默认
        direction: 'all', // 默认，其他：'row'，'col'
        limitLeftMin: 0,
        limitLeftMax: zeroWrap.offsetWidth - zero.offsetWidth,
        limitTopMin: 0,
        limitTopMax: zeroWrap.offsetHeight - zero.offsetHeight,
        isAdsorption: true,
        adsorptionDistance: 20, // 默认
    },
    data: {},
});

// 案例二
const zeroWrap2 = document.querySelector('.zero-wrap2');
const zero2 = zeroWrap1.querySelector('.zero');
new Drag({
    item: zero2,
    controlledWrap: zeroWrap2, // 拖拽item让controlledWrap移动
});
```

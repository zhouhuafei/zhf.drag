# 拖拽
* commonjs规范
```
const Drag = require('zhf.drag');

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
```

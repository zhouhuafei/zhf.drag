# 拖拽
* commonjs规范
```
const Drag = require('zhf.drag');
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
```

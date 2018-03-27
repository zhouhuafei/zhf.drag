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

// hint
const hint = document.createElement('span');
hint.className = 'drag-hint';
hint.innerHTML = `拖拽放到此处`;

// wrap1拖拽
const wrap1 = document.querySelector('.wrap1');
const item1All = wrap1.querySelectorAll('.item');
const item1Len = item1All.length;
new Drag({
    item: item1All,
    callback: {
        mouseDownBefore(obj) {
            const self = obj.self;
            const dom = obj.dom;
            dom.style.position = 'absolute';
            dom.style.left = `${dom.offsetLeft}px`;
            dom.style.top = `${dom.offsetTop}px`;
            hint.style.width = `${dom.offsetWidth}px`;
            hint.style.height = `${dom.offsetHeight}px`;
            wrap1.insertBefore(hint, dom);
            self.opts.config.limitTopMax = wrap1.offsetHeight - dom.offsetHeight;
        },
        mouseMoveAfter(obj) {
            const dom = obj.dom;
            console.log('top', dom.offsetTop, 'height', dom.offsetHeight);
            // 换位置待续...
        },
        mouseUpAfter(obj) {
            const dom = obj.dom;
            dom.setAttribute('style', '');
            wrap1.insertBefore(obj.dom, hint);
            wrap1.removeChild(hint);
        },
    },
    config: {
        limitTopMin: 0,
        direction: 'col',
    },
    data: {},
});

// wrap2拖拽
const wrap2 = document.querySelector('.wrap2');
const item2All = wrap2.querySelectorAll('.item');
const item2Len = item2All.length;

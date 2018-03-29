const Drag = require('../dist/index.min');
const offset = require('zhf.offset');
const checkDomImpact = require('zhf.check-dom-impact'); // 检测dom碰撞

// 随机添加样式
let strStyle = '';
for (let i = 1; i <= 9; i++) {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    const a = Math.round(Math.random() * (10 - 1) + 1) / 10; // 0.1 - 0.9
    const h = Math.round(Math.random() * (80 - 40) + 40);
    strStyle += `.wrap .item${i}{height:${h}px;background:rgba(${r},${g},${b},1);}`;
}
document.querySelector('style').innerHTML += strStyle;

// zero
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

// hint
const hint = document.createElement('span');
hint.className = 'drag-hint';
hint.innerHTML = `拖拽放到此处`;

// wrap1拖拽
const wrap1 = document.querySelector('.wrap1');
let item1All = wrap1.querySelectorAll('.item');
const drag1 = new Drag({
    item: item1All,
    callback: {
        mouseDownBefore(obj) {
            const self = obj.self;
            const dom = obj.dom;
            dom.classList.add('active');
            dom.style.left = `${dom.offsetLeft}px`;
            dom.style.top = `${dom.offsetTop}px`;
            hint.style.width = `${dom.offsetWidth}px`;
            hint.style.height = `${dom.offsetHeight}px`;
            wrap1.insertBefore(hint, dom);
            self.opts.config.limitTopMax = wrap1.offsetHeight - dom.offsetHeight;
        },
        mouseMoveAfter(obj) {
            const dom = obj.dom;
            const moveDirectionY = obj.moveDirectionY;
            const impact = [];
            item1All.forEach(function (item) {
                if (item !== dom && checkDomImpact(dom, item)) {
                    impact.push(item);
                }
            });
            impact.forEach(function (item) {
                const domTop = dom.offsetTop;
                const domHeight = dom.offsetHeight;
                const domBottom = domTop + domHeight;
                const itemTop = item.offsetTop;
                const itemHeight = item.offsetHeight;
                if (moveDirectionY === 'top' && domTop <= itemTop + itemHeight / 2) {
                    wrap1.insertBefore(hint, item);
                }
                if (moveDirectionY === 'bottom' && domBottom >= itemTop + itemHeight / 2) {
                    wrap1.insertBefore(hint, item.nextElementSibling); // item.nextElementSibling如果是null相当于执行了appendChild
                }
            });
        },
        mouseUpAfter(obj) {
            const dom = obj.dom;
            dom.classList.remove('active');
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

// 强行给wrap1添加一个item
const itemTest = document.createElement('span');
itemTest.className = 'item';
itemTest.innerHTML = `item test`;
wrap1.insertBefore(itemTest, item1All[0]);
drag1.events(itemTest);
item1All = wrap1.querySelectorAll('.item'); // 更新item1All

// wrap2拖拽
const wrap2 = document.querySelector('.wrap2');
const item2All = wrap2.querySelectorAll('.item');
const item2Len = item2All.length;
new Drag({
    item: item2All,
    callback: {
        mouseDownBefore(obj) {
            const dom = obj.dom;
            dom.classList.add('highlight');
            dom.cloneDom = dom.cloneNode(true);
            dom.classList.add('active');
            dom.style.left = `${dom.offsetLeft}px`;
            dom.style.top = `${dom.offsetTop}px`;
            hint.style.width = ``;
            hint.style.height = ``;
            wrap2.insertBefore(dom.cloneDom, dom);
        },
        mouseMoveAfter(obj) {
        },
        mouseUpAfter: function (obj) {
            const dom = obj.dom;
            const overDistanceX = Math.abs(obj.overDistanceX);
            const overDistanceY = Math.abs(obj.overDistanceY);
            let timeInterval = 0;
            if (overDistanceX >= 10 || overDistanceY >= 10) {
                dom.classList.add('transition');
                timeInterval = 400;
            }
            dom.style.left = `${dom.cloneDom.offsetLeft}px`;
            dom.style.top = `${dom.cloneDom.offsetTop}px`;
            setTimeout(function () {
                dom.classList.remove('highlight');
                dom.classList.remove('active');
                dom.classList.remove('transition');
                dom.setAttribute('style', '');
                wrap2.replaceChild(dom, dom.cloneDom);
            }, timeInterval);
        },
    },
    config: {},
    data: {},
});

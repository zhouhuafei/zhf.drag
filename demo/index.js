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
    const h = Math.round(Math.random() * (60 - 14) + 14);
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
            hint.style.height = `${dom.offsetHeight}px`;
            wrap1.insertBefore(hint, dom);
            self.opts.config.limitTopMax = wrap1.offsetHeight - dom.offsetHeight;
        },
        mouseMoveAfter(obj) {
            const dom = obj.dom;
            const moveDirectionY = obj.moveDirectionY;
            const impact = [];
            item1All.forEach(function (item) {
                if (item !== dom && checkDomImpact(dom, item).isImpact) {
                    impact.push(item);
                }
            });
            const domTop = dom.offsetTop;
            const domHeight = dom.offsetHeight;
            const domBottom = domTop + domHeight;
            impact.forEach(function (item) {
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

// wrap2拖拽
const wrap2 = document.querySelector('.wrap2');
const item2All = wrap2.querySelectorAll('.item');
new Drag({
    item: item2All,
    callback: {
        mouseDownBefore(obj) {
            const dom = obj.dom;
            hint.style.height = `${dom.offsetHeight}px`;
            if (dom.cloneDom) { // 防止重复创建cloneDom
                return;
            }
            dom.classList.add('highlight');
            dom.cloneDom = dom.cloneNode(true);
            dom.hasHint = false; // 是否存在提示
            dom.isImpact = false; // 是否碰撞了
            dom.classList.add('active');
            dom.style.left = `${dom.offsetLeft}px`;
            dom.style.top = `${dom.offsetTop}px`;
            wrap2.insertBefore(dom.cloneDom, dom);
        },
        mouseMoveAfter(obj) {
            const dom = obj.dom;
            dom.isImpact = checkDomImpact(dom, wrap1).isImpact; // 是否碰撞了
            const moveDirectionY = obj.moveDirectionY;
            const domLeft = offset(dom).left;
            const domTop = offset(dom).top;
            const domWidth = dom.offsetWidth;
            const domHeight = dom.offsetHeight;
            const domBottom = domTop + domHeight;
            const domCenterX = domLeft + domWidth / 2;
            const domCenterY = domTop + domHeight / 2;
            let minDistanceDom = null;
            let minDistance = null;
            if (dom.isImpact) { // 如果碰撞了，找到和dom碰的最近的那个item
                item1All.forEach(function (item) {
                    const itemLeft = offset(item).left;
                    const itemTop = offset(item).top;
                    const itemWidth = item.offsetWidth;
                    const itemHeight = item.offsetHeight;
                    const itemCenterX = itemLeft + itemWidth / 2;
                    const itemCenterY = itemTop + itemHeight / 2;
                    const x = Math.abs(domCenterX - itemCenterX);
                    const y = Math.abs(domCenterY - itemCenterY);
                    const nowMinDistance = Math.sqrt(x * x + y * y);
                    if (minDistance === null) {
                        minDistance = nowMinDistance;
                        minDistanceDom = item;
                    } else {
                        if (minDistance > nowMinDistance) {
                            minDistance = nowMinDistance;
                            minDistanceDom = item;
                        }
                    }
                });
            } else { // 如果没碰撞，则移除掉提示，并不继续往下走了
                if (dom.hasHint) {
                    wrap1.removeChild(hint);
                    dom.hasHint = false;
                }
                return;
            }
            if (dom.isImpact && !minDistanceDom) { // 碰撞了，但是最近的却不存在，说明父级容器是空的
                wrap1.appendChild(hint);
                dom.hasHint = true;
                return;
            }
            const minDistanceDomTop = offset(minDistanceDom).top;
            const minDistanceDomHeight = minDistanceDom.offsetHeight;
            if (moveDirectionY === 'top') { // 向上碰撞了
                if (domTop <= minDistanceDomTop + minDistanceDomHeight / 2) {
                    wrap1.insertBefore(hint, minDistanceDom);
                    dom.hasHint = true;
                }
            }
            if (moveDirectionY === 'bottom') { // 向下碰撞了
                if (domBottom >= minDistanceDomTop + minDistanceDomHeight / 2) {
                    wrap1.insertBefore(hint, minDistanceDom.nextElementSibling); // minDistanceDom.nextElementSibling如果是null相当于执行了appendChild
                    dom.hasHint = true;
                }
            }
        },
        mouseUpAfter: function (obj) {
            const dom = obj.dom;
            /*
            * isImpact === true，表示碰撞了。
            * 因为上面hint生成条件限制，导致hint不一定存在与wrap1中。
            * 如果满足条件，则创建一个新的item。
            * 给item加拖拽并更新item1All
            * */
            if (dom.isImpact && hint.parentNode !== null) {
                const itemNew = document.createElement('span');
                itemNew.className = `item item${/item(\d+)/.exec(dom.className)[1]}`;
                itemNew.innerHTML = dom.innerHTML;
                drag1.events(itemNew);
                wrap1.replaceChild(itemNew, hint);
                item1All = wrap1.querySelectorAll('.item');
            }
            // 松开鼠标，还原dom的位置，并移除掉cloneDom
            dom.classList.remove('highlight');
            dom.classList.remove('active');
            dom.setAttribute('style', '');
            wrap2.replaceChild(dom, dom.cloneDom);
            delete dom.cloneDom;
        },
    },
    config: {},
    data: {},
});

const extend = require('zhf.extend');
const getDomArray = require('zhf.get-dom-array');
const domAddPosition = require('zhf.dom-add-position');

class Super {
    constructor(opts) {
        this.opts = extend({
            wrap: '', // 这个容器里的直属子级可以被拖拽
            callback: {
                mouseDown: function () {
                },
                mouseMove: function () {
                },
                mouseUp: function () {
                },
            },
            config: {},
            data: {},
        }, opts);
        this.init();
    }

    init() {
        const wrapDom = getDomArray(this.opts.wrap)[0];
        if (!wrapDom) {
            return;
        }
        wrapDom.style.width = wrapDom.offsetWidth;
        wrapDom.style.height = wrapDom.offsetHeight;
        domAddPosition(wrapDom);
        const itemDom = [].slice.call(wrapDom.children);
        const positionXY = [];
        itemDom.forEach((v) => {
            positionXY.push({dom: v, left: v.offsetLeft, top: v.offsetTop});
        });
        positionXY.forEach((v) => {
            const dom = v.dom;
            domAddPosition(dom, 'absolute');
            dom.style.left = `${v.left}px`;
            dom.style.top = `${v.top}px`;
            this.events(dom);
        });
        this.wrapDom = wrapDom;
        this.itemDom = itemDom;
    }

    events(v) {
        v.addEventListener('mousedown', this.mouseDown);
        v.addEventListener('mousemove', this.mouseMove);
        v.addEventListener('mouseup', this.mouseUp);
    }

    mouseDown(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.startX = 0;
        this.startY = 0;
    }

    mouseMove(ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }

    mouseUp(ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }
}

module.exports = Super;

const extend = require('zhf.extend');
const getDomArray = require('zhf.get-dom-array');
const DomPosition = require('zhf.dom-position');
const offset = require('zhf.offset');

class Super {
    constructor(opts) {
        this.opts = extend({
            item: '', // 这个容器里的直属子级可以被拖拽
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
        const itemDom = getDomArray(this.opts.item);
        const positionXY = [];
        itemDom.forEach((v) => {
            positionXY.push({dom: v, left: v.offsetLeft, top: v.offsetTop});
        });
        positionXY.forEach((v) => {
            const dom = v.dom;
            const domPosition = new DomPosition(dom);
            const hasPosition = domPosition.hasPosition(); // 是否有非static类型的定位
            if (!hasPosition) {
                dom.style.position = `absolute`;
                dom.style.left = `${v.left}px`;
                dom.style.top = `${v.top}px`;
                dom.style.cursor = `move`;
            }
            this.events(dom);
        });
        this.itemDom = itemDom;
    }

    events(v) {
        const self = this;

        function mouseDown(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const callback = opts.callback;
            callback.mouseDown();
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        }

        function mouseMove(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const callback = opts.callback;
            console.log(ev.clientX, ev.clientY);
            callback.mouseMove();
        }

        function mouseUp(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const callback = opts.callback;
            callback.mouseUp();
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        v.addEventListener('mousedown', mouseDown);
    }
}

module.exports = Super;

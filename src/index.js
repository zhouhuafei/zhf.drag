const extend = require('zhf.extend');
const getDomArray = require('zhf.get-dom-array');
const domAddPosition = require('zhf.dom-add-position');
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
            domAddPosition(dom, 'absolute');
            dom.style.left = `${v.left}px`;
            dom.style.top = `${v.top}px`;
            dom.style.cursor = `move`;
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
        }

        v.addEventListener('mousedown', mouseDown);
        v.addEventListener('mousemove', mouseMove);
        v.addEventListener('mouseup', mouseUp);
    }
}

module.exports = Super;

const extend = require('zhf.extend');
const getDomArray = require('zhf.get-dom-array');
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
            if (getComputedStyle(dom).position === 'static') {
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
            self.disX = ev.clientX - offset(this).left;
            self.disY = ev.clientY - offset(this).top;
            callback.mouseDown();
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        }

        function mouseMove(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const callback = opts.callback;
            const left = ev.clientX - self.disX;
            const top = ev.clientY - self.disY;
            this.style.right = 'auto';
            this.style.bottom = 'auto';
            this.style.left = `${left}px`;
            this.style.top = `${top}px`;
            // 要把right和bottom去掉，统一换成left，top
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

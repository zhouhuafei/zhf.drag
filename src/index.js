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
        const itemAll = getDomArray(this.opts.item);
        const positionXY = [];
        itemAll.forEach((v) => {
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
        this.itemAll = itemAll;
    }

    events(v) {
        const self = this;

        function mouseDown(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const callback = opts.callback;
            callback.mouseDown();
            self.item = this;
            self.disX = ev.clientX - offset(this).left;
            self.disY = ev.clientY - offset(this).top;
            console.log(offset(this).left, offset(this).top);
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        }

        function mouseMove(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const callback = opts.callback;
            callback.mouseMove();
            const left = ev.clientX - self.disX;
            const top = ev.clientY - self.disY;
            self.item.style.right = 'auto';
            self.item.style.bottom = 'auto';
            self.item.style.left = `${left}px`;
            self.item.style.top = `${top}px`;
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

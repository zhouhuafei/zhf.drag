const extend = require('zhf.extend');
const getDomArray = require('zhf.get-dom-array');

class Super {
    constructor(opts) {
        this.opts = extend({
            el: '', // 哪个容器需要拖拽功能
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
        this.elDom = getDomArray(this.opts.el);
        this.elDom.forEach((v, i) => {
            const parentDom = v.parentNode;
            parentDom.style.width = parentDom.offsetWidth;
            parentDom.style.height = parentDom.offsetHeight;
            if (getComputedStyle(parentDom).position === 'static') {
                if (parentDom.style.position === '' || parentDom.style.position === 'static') {
                    parentDom.style.position = 'relative';
                }
            }

            this.events(v);
            this[`parentDom${i}`] = parentDom;
        });
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
        this.removeEventListener('mousedown', this.mouseUp);
        this.removeEventListener('mousemove', this.mouseUp);
        this.removeEventListener('mouseup', this.mouseUp);
    }
}

module.exports = Super;

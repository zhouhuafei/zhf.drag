const extend = require('zhf.extend');
const getDomArray = require('zhf.get-dom-array');

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
            config: {
                hasIconMove: true,
                direction: 'all', // 'row' 'col' 'all'
                limitLeftMin: null,
                limitLeftMax: null,
                limitTopMin: null,
                limitTopMax: null,
                isAdsorption: true,
                adsorptionDistance: 50,
            },
            data: {},
        }, opts);
        this.init();
    }

    init() {
        const opts = this.opts;
        const config = opts.config;
        const itemAll = getDomArray(opts.item);
        itemAll.forEach((dom) => {
            if (getComputedStyle(dom).position === 'static') {
                dom.style.position = `relative`;
            }
            if (config.hasIconMove && getComputedStyle(dom).cursor !== 'move') {
                dom.style.cursor = `move`;
            }
            this.events(dom);
        });
    }

    events(v) {
        const self = this;

        function mouseDown(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            self.item = this;
            const oGetComputedStyle = getComputedStyle(this);
            self.oGetComputedStyle = oGetComputedStyle;
            self.disX = ev.clientX - oGetComputedStyle.left.replace('px', '');
            self.disY = ev.clientY - oGetComputedStyle.top.replace('px', '');
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
            const callback = opts.callback;
            callback.mouseDown({dom: self.item, left: self.oGetComputedStyle.left, top: self.oGetComputedStyle.top});
        }

        function mouseMove(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const config = opts.config;
            const direction = config.direction;
            let left = ev.clientX - self.disX;
            let top = ev.clientY - self.disY;
            if (config.limitLeftMin !== null) { // 如果限制左边
                if (config.isAdsorption) { // 如果具备吸附效果
                    if (left <= config.limitLeftMin + config.adsorptionDistance) {
                        left = config.limitLeftMin;
                    }
                } else {
                    if (left <= config.limitLeftMin) {
                        left = config.limitLeftMin;
                    }
                }
            }
            if (config.limitLeftMax !== null) {
                if (config.isAdsorption) {
                    if (left >= config.limitLeftMax - config.adsorptionDistance) {
                        left = config.limitLeftMax;
                    }
                } else {
                    if (left >= config.limitLeftMax) {
                        left = config.limitLeftMax;
                    }
                }
            }
            if (config.limitTopMin !== null) {
                if (config.isAdsorption) {
                    if (top <= config.limitTopMin + config.adsorptionDistance) {
                        top = config.limitTopMin;
                    }
                } else {
                    if (top <= config.limitTopMin) {
                        top = config.limitTopMin;
                    }
                }
            }
            if (config.limitTopMax !== null) {
                if (config.isAdsorption) {
                    if (top >= config.limitTopMax - config.adsorptionDistance) {
                        top = config.limitTopMax;
                    }
                } else {
                    if (top >= config.limitTopMax) {
                        top = config.limitTopMax;
                    }
                }
            }
            self.item.style.right = 'auto';
            self.item.style.bottom = 'auto';
            if (direction === 'all') {
                self.item.style.left = `${left}px`;
                self.item.style.top = `${top}px`;
            }
            if (direction === 'col') {
                self.item.style.top = `${top}px`;
            }
            if (direction === 'row') {
                self.item.style.left = `${left}px`;
            }
            const callback = opts.callback;
            callback.mouseMove({dom: self.item, left: self.oGetComputedStyle.left, top: self.oGetComputedStyle.top});
        }

        function mouseUp(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            const callback = opts.callback;
            callback.mouseUp({dom: self.item, left: self.oGetComputedStyle.left, top: self.oGetComputedStyle.top});
        }

        v.addEventListener('mousedown', mouseDown);
    }
}

module.exports = Super;

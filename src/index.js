const extend = require('zhf.extend');
const getDomArray = require('zhf.get-dom-array');

class Super {
    constructor(opts) {
        this.opts = extend({
            item: '', // 这个容器里的直属子级可以被拖拽
            callback: {
                mouseDownBefore: function () {
                },
                mouseDownAfter: function () {
                },
                mouseMoveBefore: function () {
                },
                mouseMoveAfter: function () {
                },
                mouseUpBefore: function () {
                },
                mouseUpAfter: function () {
                },
            },
            config: {
                hasIconMove: true,
                direction: 'all', // 'row' 'col' 'all'
                limitLeftMin: null,
                limitLeftMax: null,
                limitTopMin: null,
                limitTopMax: null,
                isAdsorption: false,
                adsorptionDistance: 20,
            },
            data: {},
        }, opts);
        getDomArray(this.opts.item).forEach((dom) => {
            this.events(dom);
        });
    }

    events(dom) {
        const self = this;
        const opts = self.opts;
        const config = opts.config;
        if (getComputedStyle(dom).position === 'static') {
            dom.style.position = `relative`;
        }
        if (config.hasIconMove && getComputedStyle(dom).cursor !== 'move') {
            dom.style.cursor = `move`;
        }

        function mouseDown(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            self.moveSpeedX = 0; // 鼠标移动时X轴的移动速度
            self.moveSpeedY = 0; // 鼠标移动时Y轴的移动速度
            self.moveDirectionX = 'no-move'; // 鼠标移动的时候，水平方向往哪个方形移动，相对于鼠标上次移动的位置
            self.moveDirectionY = 'no-move'; // 鼠标移动的时候，垂直方向往哪个方形移动，相对于鼠标上次移动的位置
            self.overDirectionX = 'no-move'; // 鼠标移动的时候，水平方向往哪个方形移动，相对于鼠标按下时的位置
            self.overDirectionY = 'no-move'; // 鼠标移动的时候，垂直方向往哪个方形移动，相对于鼠标按下时的位置
            self.prevMoveClientX = ev.clientX; // 上次移动鼠标时X轴的可视距离
            self.prevMoveClientY = ev.clientY; // 上次移动鼠标时Y轴的可视距离
            self.mouseDownClientX = ev.clientX; // 鼠标按下时X轴的可视距离
            self.mouseDownClientY = ev.clientY; // 鼠标按下时Y轴的可视距离
            const callback = opts.callback;
            callback.mouseDownBefore({
                self: self,
                ev: ev,
                dom: dom,
                moveSpeedX: self.moveSpeedX,
                moveSpeedY: self.moveSpeedY,
                moveDirectionX: self.moveDirectionX,
                moveDirectionY: self.moveDirectionY,
                overDirectionX: self.overDirectionX,
                overDirectionY: self.overDirectionY,
            });
            const oGetComputedStyle = getComputedStyle(this);
            self.oGetComputedStyle = oGetComputedStyle;
            self.disX = ev.clientX - oGetComputedStyle.left.replace('px', '');
            self.disY = ev.clientY - oGetComputedStyle.top.replace('px', '');
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
            callback.mouseDownAfter({
                self: self,
                ev: ev,
                dom: dom,
                moveSpeedX: self.moveSpeedX,
                moveSpeedY: self.moveSpeedY,
                moveDirectionX: self.moveDirectionX,
                moveDirectionY: self.moveDirectionY,
                overDirectionX: self.overDirectionX,
                overDirectionY: self.overDirectionY,
            });
        }

        function mouseMove(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const callback = opts.callback;
            callback.mouseMoveBefore({
                self: self,
                ev: ev,
                dom: dom,
                moveSpeedX: self.moveSpeedX,
                moveSpeedY: self.moveSpeedY,
                moveDirectionX: self.moveDirectionX,
                moveDirectionY: self.moveDirectionY,
                overDirectionX: self.overDirectionX,
                overDirectionY: self.overDirectionY,
            });
            const config = opts.config;
            const direction = config.direction;
            let left = ev.clientX - self.disX;
            let top = ev.clientY - self.disY;
            // 限制
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
            // 赋值
            dom.style.right = 'auto';
            dom.style.bottom = 'auto';
            if (direction === 'all') {
                dom.style.left = `${left}px`;
                dom.style.top = `${top}px`;
            }
            if (direction === 'col') {
                dom.style.top = `${top}px`;
            }
            if (direction === 'row') {
                dom.style.left = `${left}px`;
            }
            // 移动方向和移动速度 - 相对于鼠标上次移动时的位置
            self.moveSpeedX = ev.clientX - self.prevMoveClientX;
            self.moveSpeedY = ev.clientY - self.prevMoveClientY;
            if (self.moveSpeedX > 0) {
                self.moveDirectionX = 'right';
            } else if (self.moveSpeedX < 0) {
                self.moveDirectionX = 'left';
            }
            if (self.moveSpeedY > 0) {
                self.moveDirectionY = 'bottom';
            } else if (self.moveSpeedY < 0) {
                self.moveDirectionY = 'top';
            }
            self.prevMoveClientX = ev.clientX;
            self.prevMoveClientY = ev.clientY;
            // 移动方向 - 相对于鼠标按下时的位置
            const resultX = ev.clientX - self.mouseDownClientX;
            const resultY = ev.clientY - self.mouseDownClientY;
            if (resultX > 0) {
                self.overDirectionX = 'right';
            } else if (resultX < 0) {
                self.overDirectionX = 'left';
            }
            if (resultY > 0) {
                self.overDirectionY = 'bottom';
            } else if (resultY < 0) {
                self.overDirectionY = 'top';
            }
            callback.mouseMoveAfter({
                self: self,
                ev: ev,
                dom: dom,
                moveSpeedX: self.moveSpeedX,
                moveSpeedY: self.moveSpeedY,
                moveDirectionX: self.moveDirectionX,
                moveDirectionY: self.moveDirectionY,
                overDirectionX: self.overDirectionX,
                overDirectionY: self.overDirectionY,
            });
        }

        function mouseUp(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            const opts = self.opts;
            const callback = opts.callback;
            callback.mouseUpBefore({
                self: self,
                ev: ev,
                dom: dom,
                moveSpeedX: self.moveSpeedX,
                moveSpeedY: self.moveSpeedY,
                moveDirectionX: self.moveDirectionX,
                moveDirectionY: self.moveDirectionY,
                overDirectionX: self.overDirectionX,
                overDirectionY: self.overDirectionY,
            });
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
            callback.mouseUpAfter({
                self: self,
                ev: ev,
                dom: dom,
                moveSpeedX: self.moveSpeedX,
                moveSpeedY: self.moveSpeedY,
                moveDirectionX: self.moveDirectionX,
                moveDirectionY: self.moveDirectionY,
                overDirectionX: self.overDirectionX,
                overDirectionY: self.overDirectionY,
            });
        }

        dom.addEventListener('mousedown', mouseDown);
    }
}

module.exports = Super;

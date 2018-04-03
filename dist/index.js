'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = require('zhf.extend');
var getDomArray = require('zhf.get-dom-array');

var Super = function () {
    function Super(opts) {
        var _this = this;

        _classCallCheck(this, Super);

        this.opts = extend({
            item: '', // 这个容器里的直属子级可以被拖拽
            controlledWrap: null, // 拖拽item让controlledWrap移动
            callback: {
                mouseDownBefore: function mouseDownBefore(obj) {},
                mouseDownAfter: function mouseDownAfter(obj) {},
                mouseMoveBefore: function mouseMoveBefore(obj) {},
                mouseMoveAfter: function mouseMoveAfter(obj) {},
                mouseUpBefore: function mouseUpBefore(obj) {},
                mouseUpAfter: function mouseUpAfter(obj) {}
            },
            config: {
                hasIconMove: true,
                direction: 'all', // 'all'，'row'，'col'
                limitLeftMin: null,
                limitLeftMax: null,
                limitTopMin: null,
                limitTopMax: null,
                isAdsorption: false,
                adsorptionDistance: 20
            },
            data: {}
        }, opts);
        getDomArray(this.opts.item).forEach(function (dom) {
            _this.events(dom);
        });
    }

    _createClass(Super, [{
        key: 'events',
        value: function events(dom) {
            var self = this;
            var opts = self.opts;
            var config = opts.config;
            // 添加遮罩，防止点的是链接，跳转了。
            var mask = document.createElement('span');
            mask.setAttribute('style', 'position: absolute;width: 100%;height: 100%;z-index: 9999;left: 0;top: 0;');
            dom.appendChild(mask);
            // 添加定位
            if (getComputedStyle(dom).position === 'static') {
                dom.style.position = 'relative';
            }
            if (config.hasIconMove && getComputedStyle(dom).cursor !== 'move') {
                dom.style.cursor = 'move';
            }
            var controlledWrapDom = getDomArray(opts.controlledWrap)[0];
            if (controlledWrapDom && getComputedStyle(controlledWrapDom).position === 'static') {
                controlledWrapDom.style.position = 'relative';
            }
            self.dom = dom; // 把dom提供给外部
            self.controlledWrapDom = controlledWrapDom; // 把controlledWrapDom提供给外部

            function mouseDown(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                self.moveDistanceX = 0; // 鼠标每次移动时X轴的移动距离(移动速度)
                self.moveDistanceY = 0; // 鼠标每次移动时Y轴的移动距离(移动速度)
                self.moveDirectionX = 'no-move'; // 鼠标移动的时候，水平方向往哪个方形移动，相对于鼠标上次移动的位置
                self.moveDirectionY = 'no-move'; // 鼠标移动的时候，垂直方向往哪个方形移动，相对于鼠标上次移动的位置
                self.overDistanceX = 0; // 鼠标按下到鼠标松开这段X轴的移动距离
                self.overDistanceY = 0; // 鼠标按下到鼠标松开这段Y轴的移动距离
                self.overDirectionX = 'no-move'; // 鼠标移动的时候，水平方向往哪个方形移动，相对于鼠标按下时的位置
                self.overDirectionY = 'no-move'; // 鼠标移动的时候，垂直方向往哪个方形移动，相对于鼠标按下时的位置
                self.prevMoveClientX = ev.clientX; // 上次移动鼠标时X轴的可视距离
                self.prevMoveClientY = ev.clientY; // 上次移动鼠标时Y轴的可视距离
                self.mouseDownClientX = ev.clientX; // 鼠标按下时X轴的可视距离
                self.mouseDownClientY = ev.clientY; // 鼠标按下时Y轴的可视距离
                var callback = opts.callback;
                callback.mouseDownBefore({
                    self: self,
                    ev: ev,
                    dom: dom,
                    controlledWrapDom: controlledWrapDom,
                    moveDistanceX: self.moveDistanceX,
                    moveDistanceY: self.moveDistanceY,
                    moveDirectionX: self.moveDirectionX,
                    moveDirectionY: self.moveDirectionY,
                    overDistanceX: self.overDistanceX,
                    overDistanceY: self.overDistanceY,
                    overDirectionX: self.overDirectionX,
                    overDirectionY: self.overDirectionY
                });
                var oGetComputedStyle = getComputedStyle(dom);
                if (controlledWrapDom) {
                    oGetComputedStyle = getComputedStyle(controlledWrapDom);
                }
                self.oGetComputedStyle = oGetComputedStyle;
                self.disX = ev.clientX - oGetComputedStyle.left.replace('px', '');
                self.disY = ev.clientY - oGetComputedStyle.top.replace('px', '');
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('mouseup', mouseUp);
                callback.mouseDownAfter({
                    self: self,
                    ev: ev,
                    dom: dom,
                    controlledWrapDom: controlledWrapDom,
                    moveDistanceX: self.moveDistanceX,
                    moveDistanceY: self.moveDistanceY,
                    moveDirectionX: self.moveDirectionX,
                    moveDirectionY: self.moveDirectionY,
                    overDistanceX: self.overDistanceX,
                    overDistanceY: self.overDistanceY,
                    overDirectionX: self.overDirectionX,
                    overDirectionY: self.overDirectionY
                });
            }

            function mouseMove(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                var callback = opts.callback;
                callback.mouseMoveBefore({
                    self: self,
                    ev: ev,
                    dom: dom,
                    controlledWrapDom: controlledWrapDom,
                    moveDistanceX: self.moveDistanceX,
                    moveDistanceY: self.moveDistanceY,
                    moveDirectionX: self.moveDirectionX,
                    moveDirectionY: self.moveDirectionY,
                    overDistanceX: self.overDistanceX,
                    overDistanceY: self.overDistanceY,
                    overDirectionX: self.overDirectionX,
                    overDirectionY: self.overDirectionY
                });
                var config = opts.config;
                var direction = config.direction;
                var left = ev.clientX - self.disX;
                var top = ev.clientY - self.disY;
                // 限制
                if (config.limitLeftMin !== null) {
                    // 如果限制左边
                    if (config.isAdsorption) {
                        // 如果具备吸附效果
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
                var moveDom = dom;
                if (controlledWrapDom) {
                    moveDom = controlledWrapDom;
                }
                moveDom.style.right = 'auto';
                moveDom.style.bottom = 'auto';
                if (direction === 'all') {
                    moveDom.style.left = left + 'px';
                    moveDom.style.top = top + 'px';
                }
                if (direction === 'col') {
                    moveDom.style.top = top + 'px';
                }
                if (direction === 'row') {
                    moveDom.style.left = left + 'px';
                }
                // 移动方向和移动距离(移动速度) - 相对于鼠标上次移动时的位置
                self.moveDistanceX = ev.clientX - self.prevMoveClientX;
                self.moveDistanceY = ev.clientY - self.prevMoveClientY;
                if (self.moveDistanceX > 0) {
                    self.moveDirectionX = 'right';
                } else if (self.moveDistanceX < 0) {
                    self.moveDirectionX = 'left';
                }
                if (self.moveDistanceY > 0) {
                    self.moveDirectionY = 'bottom';
                } else if (self.moveDistanceY < 0) {
                    self.moveDirectionY = 'top';
                }
                self.prevMoveClientX = ev.clientX;
                self.prevMoveClientY = ev.clientY;
                // 移动方向和移动距离 - 相对于鼠标按下时的位置
                self.overDistanceX = ev.clientX - self.mouseDownClientX;
                self.overDistanceY = ev.clientY - self.mouseDownClientY;
                if (self.overDistanceX > 0) {
                    self.overDirectionX = 'right';
                } else if (self.overDistanceX < 0) {
                    self.overDirectionX = 'left';
                }
                if (self.overDistanceY > 0) {
                    self.overDirectionY = 'bottom';
                } else if (self.overDistanceY < 0) {
                    self.overDirectionY = 'top';
                }
                callback.mouseMoveAfter({
                    self: self,
                    ev: ev,
                    dom: dom,
                    controlledWrapDom: controlledWrapDom,
                    moveDistanceX: self.moveDistanceX,
                    moveDistanceY: self.moveDistanceY,
                    moveDirectionX: self.moveDirectionX,
                    moveDirectionY: self.moveDirectionY,
                    overDistanceX: self.overDistanceX,
                    overDistanceY: self.overDistanceY,
                    overDirectionX: self.overDirectionX,
                    overDirectionY: self.overDirectionY
                });
            }

            function mouseUp(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                var callback = opts.callback;
                callback.mouseUpBefore({
                    self: self,
                    ev: ev,
                    dom: dom,
                    controlledWrapDom: controlledWrapDom,
                    moveDistanceX: self.moveDistanceX,
                    moveDistanceY: self.moveDistanceY,
                    moveDirectionX: self.moveDirectionX,
                    moveDirectionY: self.moveDirectionY,
                    overDistanceX: self.overDistanceX,
                    overDistanceY: self.overDistanceY,
                    overDirectionX: self.overDirectionX,
                    overDirectionY: self.overDirectionY
                });
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseUp);
                callback.mouseUpAfter({
                    self: self,
                    ev: ev,
                    dom: dom,
                    controlledWrapDom: controlledWrapDom,
                    moveDistanceX: self.moveDistanceX,
                    moveDistanceY: self.moveDistanceY,
                    moveDirectionX: self.moveDirectionX,
                    moveDirectionY: self.moveDirectionY,
                    overDistanceX: self.overDistanceX,
                    overDistanceY: self.overDistanceY,
                    overDirectionX: self.overDirectionX,
                    overDirectionY: self.overDirectionY
                });
            }

            dom.addEventListener('mousedown', mouseDown);
        }
    }]);

    return Super;
}();

module.exports = Super;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = require('zhf.extend');
var getDomArray = require('zhf.get-dom-array');

var Super = function () {
    function Super(opts) {
        _classCallCheck(this, Super);

        this.opts = extend({
            item: '', // 这个容器里的直属子级可以被拖拽
            callback: {
                mouseDown: function mouseDown() {},
                mouseMove: function mouseMove() {},
                mouseUp: function mouseUp() {}
            },
            config: {
                hasIconMove: true,
                direction: 'all', // 'row' 'col' 'all'
                limitLeftMin: null,
                limitLeftMax: null,
                limitTopMin: null,
                limitTopMax: null,
                isAdsorption: true
            },
            data: {}
        }, opts);
        this.init();
    }

    _createClass(Super, [{
        key: 'init',
        value: function init() {
            var _this = this;

            var opts = this.opts;
            var config = opts.config;
            var itemAll = getDomArray(opts.item);
            itemAll.forEach(function (dom) {
                if (getComputedStyle(dom).position === 'static') {
                    dom.style.position = 'relative';
                }
                if (config.hasIconMove && getComputedStyle(dom).cursor !== 'move') {
                    dom.style.cursor = 'move';
                }
                _this.events(dom);
            });
        }
    }, {
        key: 'events',
        value: function events(v) {
            var self = this;

            function mouseDown(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                self.item = this;
                var oGetComputedStyle = getComputedStyle(this);
                self.oGetComputedStyle = oGetComputedStyle;
                self.disX = ev.clientX - oGetComputedStyle.left.replace('px', '');
                self.disY = ev.clientY - oGetComputedStyle.top.replace('px', '');
                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('mouseup', mouseUp);
                var callback = opts.callback;
                callback.mouseDown({ dom: self.item, left: self.oGetComputedStyle.left, top: self.oGetComputedStyle.top });
            }

            function mouseMove(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                var config = opts.config;
                var direction = config.direction;
                var left = ev.clientX - self.disX;
                var top = ev.clientY - self.disY;
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
                self.item.style.right = 'auto';
                self.item.style.bottom = 'auto';
                if (direction === 'all') {
                    self.item.style.left = left + 'px';
                    self.item.style.top = top + 'px';
                }
                if (direction === 'col') {
                    self.item.style.top = top + 'px';
                }
                if (direction === 'row') {
                    self.item.style.left = left + 'px';
                }
                var callback = opts.callback;
                callback.mouseMove({ dom: self.item, left: self.oGetComputedStyle.left, top: self.oGetComputedStyle.top });
            }

            function mouseUp(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseUp);
                var callback = opts.callback;
                callback.mouseUp({ dom: self.item, left: self.oGetComputedStyle.left, top: self.oGetComputedStyle.top });
            }

            v.addEventListener('mousedown', mouseDown);
        }
    }]);

    return Super;
}();

module.exports = Super;
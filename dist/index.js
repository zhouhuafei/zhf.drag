'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = require('zhf.extend');
var getDomArray = require('zhf.get-dom-array');
var offset = require('zhf.offset');

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
            config: {},
            data: {}
        }, opts);
        this.init();
    }

    _createClass(Super, [{
        key: 'init',
        value: function init() {
            var _this = this;

            var itemAll = getDomArray(this.opts.item);
            var positionXY = [];
            itemAll.forEach(function (v) {
                positionXY.push({ dom: v, left: v.offsetLeft, top: v.offsetTop });
            });
            positionXY.forEach(function (v) {
                var dom = v.dom;
                if (getComputedStyle(dom).position === 'static') {
                    dom.style.position = 'absolute';
                    dom.style.left = v.left + 'px';
                    dom.style.top = v.top + 'px';
                    dom.style.cursor = 'move';
                }
                _this.events(dom);
            });
            this.itemAll = itemAll;
        }
    }, {
        key: 'events',
        value: function events(v) {
            var self = this;

            function mouseDown(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                var callback = opts.callback;
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
                var opts = self.opts;
                var callback = opts.callback;
                callback.mouseMove();
                var left = ev.clientX - self.disX;
                var top = ev.clientY - self.disY;
                self.item.style.right = 'auto';
                self.item.style.bottom = 'auto';
                self.item.style.left = left + 'px';
                self.item.style.top = top + 'px';
            }

            function mouseUp(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                var callback = opts.callback;
                callback.mouseUp();
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseUp);
            }

            v.addEventListener('mousedown', mouseDown);
        }
    }]);

    return Super;
}();

module.exports = Super;
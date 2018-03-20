'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = require('zhf.extend');
var getDomArray = require('zhf.get-dom-array');
var domAddPosition = require('zhf.dom-add-position');
var offset = require('zhf.offset');

var Super = function () {
    function Super(opts) {
        _classCallCheck(this, Super);

        this.opts = extend({
            wrap: '', // 这个容器里的直属子级可以被拖拽
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

            var wrapDom = getDomArray(this.opts.wrap)[0];
            if (!wrapDom) {
                return;
            }
            wrapDom.style.width = wrapDom.offsetWidth + 'px';
            wrapDom.style.height = wrapDom.offsetHeight + 'px';
            domAddPosition(wrapDom);
            var itemDom = [].slice.call(wrapDom.children);
            var positionXY = [];
            itemDom.forEach(function (v) {
                positionXY.push({ dom: v, left: v.offsetLeft, top: v.offsetTop });
            });
            positionXY.forEach(function (v) {
                var dom = v.dom;
                domAddPosition(dom, 'absolute');
                dom.style.left = v.left + 'px';
                dom.style.top = v.top + 'px';
                dom.style.cursor = 'move';
                _this.events(dom);
            });
            this.wrapDom = wrapDom;
            this.itemDom = itemDom;
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
            }

            function mouseMove(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                var callback = opts.callback;
                console.log(ev.clientX, ev.clientY);
                callback.mouseMove();
            }

            function mouseUp(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                var opts = self.opts;
                var callback = opts.callback;
                callback.mouseUp();
            }

            v.addEventListener('mousedown', mouseDown);
            v.addEventListener('mousemove', mouseMove);
            v.addEventListener('mouseup', mouseUp);
        }
    }]);

    return Super;
}();

module.exports = Super;
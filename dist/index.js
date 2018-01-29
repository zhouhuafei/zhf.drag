'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = require('zhf.extend');
var getDomArray = require('zhf.get-dom-array');

var Super = function () {
    function Super(opts) {
        _classCallCheck(this, Super);

        this.opts = extend({
            el: '', // 哪个容器需要拖拽功能
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

            this.elDom = getDomArray(this.opts.el);
            this.elDom.forEach(function (v) {
                _this.events(v);
            });
        }
    }, {
        key: 'events',
        value: function events(v) {
            v.addEventListener('mousedown', this.mouseDown);
            v.addEventListener('mousemove', this.mouseMove);
            v.addEventListener('mouseup', this.mouseUp);
        }
    }, {
        key: 'mouseDown',
        value: function mouseDown(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.startX = 0;
            this.startY = 0;
        }
    }, {
        key: 'mouseMove',
        value: function mouseMove(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
    }, {
        key: 'mouseUp',
        value: function mouseUp(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.removeEventListener('mousedown', this.mouseUp);
            this.removeEventListener('mousemove', this.mouseUp);
            this.removeEventListener('mouseup', this.mouseUp);
        }
    }]);

    return Super;
}();

module.exports = Super;
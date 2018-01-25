'use strict';

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

var extend = require('zhf.extend');
console.log(extend);

var Super = function () {
    function Super(opts) {
        _classCallCheck(this, Super);

        this.opts = extend({}, opts);
        this.init();
    }

    _createClass(Super, [{
        key: 'init',
        value: function init() {
        }
    }]);

    return Super;
}();

module.exports = Super;

const extend = require('zhf.extend');
const getDomArray = require('zhf.get-dom-array');

class Super {
    constructor(opts) {
        this.opts = extend({
            el: '', // 哪个容器需要拖拽功能
            callback: {},
            config: {},
            data: {},
        }, opts);
        this.init();
    }

    init() {
        this.elDom = getDomArray(this.opts.el);
    }
}

module.exports = Super;

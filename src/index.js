const extend = require('zhf.extend');

class Super {
    constructor(opts) {
        this.opts = extend({
            wrap: '', // 哪个容器需要拖拽功能
            callback: {},
            config: {},
            data: {},
        }, opts);
        this.init();
    }

    init() {
    }
}

module.exports = Super;

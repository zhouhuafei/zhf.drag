const extend = require('zhf.extend');

class Super {
    constructor(opts) {
        this.opts = extend({}, opts);
        this.init();
    }

    init() {
    }
}

module.exports = Super;

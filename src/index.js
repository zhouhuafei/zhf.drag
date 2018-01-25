const extend = require('zhf.extend');
console.log(extend);

class Super {
    constructor(opts) {
        this.opts = extend({}, opts);
        this.init();
    }

    init() {
    }
}

module.exports = Super;

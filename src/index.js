(function (name, factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') { // nodejs - commonjs canon
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) { // requirejs - amd canon
        define(factory);
    } else { // window - browser canon
        this[name] = factory();
    }
})('Drag', function () {
    class Drag {
        constructor(opts) {
            this.opts = opts || {};
        }
    }

    return Drag;
});

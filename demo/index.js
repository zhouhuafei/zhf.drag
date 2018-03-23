const Drag = require('../dist/index.min');
new Drag({
    item: '.zero',
    callback: {},
    config: {},
    data: {},
});
new Drag({
    item: '.wrap1 .item',
    callback: {},
    config: {},
    data: {},
});
new Drag({
    item: '.wrap2 .item',
    callback: {
        mouseDown: function (obj) {
            console.log(obj);
        },
        mouseMove: function (obj) {
            console.log(obj);
        },
        mouseUp: function (obj) {
            console.log(obj);
        },
    },
    config: {},
    data: {},
});

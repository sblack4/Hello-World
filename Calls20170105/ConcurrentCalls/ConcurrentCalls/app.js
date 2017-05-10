"use strict";
const d3 = require('d3');
const Graph_1 = require('./Graph');
window.onload = () => {
    var el = document.getElementById('content');
    const dataPath = 'Calls20170105.csv';
    d3.csv(dataPath, function (error, data) {
        if (error) {
            console.warn(error);
        }
        else {
            console.debug("main, data >>> ", data);
            Graph_1.RunGraph(data);
        }
    });
};
//# sourceMappingURL=app.js.map
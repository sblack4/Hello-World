/* global $, crossfilter, d3 */

(function (topReps) {
    'use strict';

    function ready() {
        d3.json("../data/calls.json", function (error, data) {
            if (error) console.warn(error);

            topReps.group = data.HeaderInfo[0].GroupingField;
            topReps.measure = data.HeaderInfo[0].CountingField;
            topReps.xAxisMax = data.HeaderInfo[0].xAxisMax;

            topReps.data.calls = data.dt;

            topReps.makeFilterDimensions(data.dt);

            topReps.populateDropdowns();

            topReps.addFilters();
            topReps.cycleTeams();
            topReps.onDataChange();
        });

    };
    ready();

}(window.topReps = window.topReps || {}));
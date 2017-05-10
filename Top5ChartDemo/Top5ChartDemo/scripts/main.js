/* global $, crossfilter, d3 */

(function (topReps) {
    'use strict';

    var q = d3.queue()
        .defer(d3.json, "../data/calls.json")
        .defer(d3.json, "../data/occs.json")
        .defer(d3.json, "../data/quotes.json");
    q.await(ready);

    function ready(error, calls, occs, quotes){
        if (error) console.warn(error);

        topReps.data.calls = calls.dt;
        topReps.data.occs = occs.dt;
        topReps.data.quotes = quotes.dt;
        //topReps.data.dataBall = topReps.joinJson([calls.dt, occs.dt, quotes.dt]);

        topReps.makeFilterDimensions(calls.dt, occs.dt, quotes.dt);

        topReps.populateDropdowns();

        topReps.addFilters();
        topReps.cycleTeams();
        topReps.onDataChange();
    }

}(window.topReps = window.topReps || {}));
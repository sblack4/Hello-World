/* global $, _, crossfilter, d3 */

(function (topReps) {
    'use strict';

    topReps.data = {};
    topReps.TRANS_DURATION = 2000;
    topReps.CYCLE_DURATION = 5000;
    topReps.dropDowns = {
        TeamDim : $('#TeamDim')
    };
    topReps.activeFilters = {
        userDim: [],
        TeamDim: [],
        callsDim: [],
        occsDim: [],
        quoteDim: []
    };

    topReps.filterFunctions = {
        userDim: [],
        TeamDim: function () {
            if (!topReps.activeFilters.TeamDim) {
                return topReps[topReps.data_group].top(topReps.n_reps);
            } else {
                return topReps.TeamDim.filterFunction(function (d) {
                    return ($.inArray(d, topReps.activeFilters.TeamDim) >= 0) ? d : null;
                }).top(Infinity);
            }
        },
        callsDim: [],
        occsDim: [],
        quoteDim: []
    };

    topReps.makeFilterDimensions = function (array1, ...rest) {

        var array = array1.concat(...rest);
        topReps.filter = crossfilter(array);

        topReps.userDim = topReps.filter.dimension(function (o) {
            return (o.UserName) ? o.UserName : null;
        });
        topReps.TeamDim = topReps.filter.dimension(function (o) {
            return (o.TeamName) ? o.TeamName : null;
        });
        topReps.callsDim = topReps.filter.dimension(function (o) {//I was copying code that used o but d is easier to type
            return (o.cpm > 0) ? o.cpm : null;
        });
        topReps.occsDim = topReps.filter.dimension(function (d) {
            return (d.sum_order > 0) ? d.sum_order : null;
        });
        topReps.quoteDim = topReps.filter.dimension(function (d) {
            return (d.n_f3_records > 0) ? d.n_f3_records : null; 
        }); 
    };

    topReps.getData = function () {
        return topReps[topReps.data_group].top(topReps.n_reps);
    };


    topReps.onDataChange = function () {
        var data = topReps.getData();
        topReps.updateBars(data);
        //topReps.cycleTeams(topReps.TeamDim.group().all());
    };
    
}(window.topReps = window.topReps || {}));
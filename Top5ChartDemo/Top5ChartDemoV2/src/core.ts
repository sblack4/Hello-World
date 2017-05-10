/*  methods for the bars.ts
*/

import * as crossfilter from 'crossfilter'
import { updateBars, createBarsTemplate } from './bars';
import { fileData } from './main';

declare interface filterDimensions {
    filter: CrossFilter.CrossFilter<any>;
    userDim: CrossFilter.Dimension<any, any>;
    teamDim: CrossFilter.Dimension<any, any>;
    measureDim: CrossFilter.Dimension<any, any>;
}

declare interface topReps {
    TRANS_DURATION: number;
    CYCLE_DURATION: number;
    n_reps: number;
    reps_offset: number;
    data_group: string;
    activeFilters: any;
    filterFunctions: any;
    filterDimensions: filterDimensions;
    getData: Function;
    onDataChange: Function;
}
let topReps = {} as topReps; //Instantiate interface 
topReps.TRANS_DURATION = 2000;
topReps.CYCLE_DURATION = 5000;
topReps.n_reps = 10;
topReps.reps_offset= 10;
topReps.data_group = "measureDim";
topReps.activeFilters = {
    userDim: [],
    teamDim: [],
    measureDim: []
};
topReps.filterFunctions = {
    userDim: [],
    teamDim: function () {
        if (!topReps.activeFilters.teamDim) {
            return topReps[topReps.data_group].top(topReps.n_reps);
        } else {
            return topReps.filterDimensions.teamDim.filterFunction(function (d) {
                return ($.inArray(d, topReps.activeFilters.teamDim) >= 0) ? d : null;
            }).top(Infinity);
        }
    },
    measureDim: []
};
let  makeFilterDimensions = function(array1, ...rest) {
    topReps.filterDimensions = {} as filterDimensions;
    var array = array1.concat(...rest);
    topReps.filterDimensions.filter = crossfilter(array);

    topReps.filterDimensions.userDim = topReps.filterDimensions.filter.dimension(function (o: any) {
        return (o[fileData.group]) ? o[fileData.group] : null;
    });
    topReps.filterDimensions.teamDim = topReps.filterDimensions.filter.dimension(function (o: any) {
        return (o.TeamName) ? o.TeamName : null;
    });
    topReps.filterDimensions.measureDim = topReps.filterDimensions.filter.dimension(function (o: any) {//I was copying code that used o but d is easier to type
        return (o[fileData.measure] > 0) ? o[fileData.measure] : null;
    });
};

topReps.getData = function (rep_range = topReps.n_reps) {
    let data = topReps.filterDimensions.measureDim.top(rep_range);
    return data;
};


topReps.onDataChange = function (rep_range=topReps.n_reps) {
    var data = topReps.getData(rep_range);
    updateBars(data);
    //topReps.cycleTeams(topReps.TeamDim.group().all());
};

let cycleTeams = function () {
    let i = 0;
    var teams = topReps.filterDimensions.teamDim.group().all();
    var num_teams = topReps.filterDimensions.teamDim.group().all().length;
    setInterval(teamSwitch, topReps.CYCLE_DURATION);
    function teamSwitch() {
        $('#selectedTeam').text(teams[i % num_teams].key);
        topReps.activeFilters.teamDim = [];
        topReps.activeFilters.teamDim.push(teams[i % num_teams].key);
        topReps.filterFunctions.teamDim.call();
        topReps.onDataChange();
        i++;
    };
};

var cycleReps = function () {
    createBarsTemplate();
    var i = 0;
    var users = topReps.filterDimensions.userDim.group().all();
    var num_users = topReps.filterDimensions.userDim.group().all().length;
    var allUsers = topReps.getData(Infinity);
    this.teamSwitch = () => {
        let currentRep = i % (num_users-topReps.reps_offset);
        let lastRep = currentRep + topReps.reps_offset;
        let currentUsers = [];
        for (var j = currentRep; j < lastRep; j++){
            allUsers[j].rank = j+1;
            currentUsers.push(allUsers[j]);
        }
        updateBars(currentUsers);
        i++;
    };
    setInterval(this.teamSwitch, topReps.CYCLE_DURATION);
};


export { topReps, makeFilterDimensions, cycleTeams, cycleReps };


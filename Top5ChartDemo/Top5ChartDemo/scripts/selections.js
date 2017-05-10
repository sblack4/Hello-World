/* global $, _, crossfilter, d3 */
(function (topReps) {
    'use strict';
    topReps.n_reps = 10;
    var n_users_control = $('#n_reps');
    n_users_control.on('keyup', function (keypress) {
        if (keypress.keyCode == 13) {
            console.log("n_users: ", n_users_control.val());
            topReps.n_reps = n_users_control.val();
            topReps.onDataChange();
        }
    });

    topReps.data_group = "callsDim";
    $('#selectedDim').text("CPM");
    var data_group_control = $('.dataButton');
    data_group_control.on('click', function (click) {
        console.log("selection: ", click.target.id);
        let click_id = click.target.id;
        if (click_id != topReps.data_group) {
            topReps[topReps.data_group].filterAll();
            topReps.data_group = click_id;
            topReps.onDataChange();
        }
    });


    //Populate Dropdowns
    topReps.populateDropdowns = function () {
        for (var filter in topReps.dropDowns) {
            $.each(topReps[filter].group().all(), function () {
                topReps.dropDowns[filter].append($("<li />").append(`<a>${this.key}</a>`));
            });
        }
    };

    //Event Handlers for Dropdowns 



    topReps.filterOnClick = function (button) {
        $(button).click(function (e) {
            clearInterval(topReps.timer);
            topReps.clearActiveFilters(true);
            console.log("this filter: ", this.id);
            console.log("filter this: ", e.target.innerHTML);
            //$('#filters').append('\\', e.target.innerHTML);
            if(this.id=="TeamDim") $('#selectedTeam').text(e.target.innerHTML);
            else{
                $('#selectedDim').text(e.target.innerHTML);
            }
            topReps.activeFilters[this.id].push(e.target.innerHTML);
            console.log(topReps.activeFilters[this.id]);
            console.log(topReps.filterFunctions[this.id].call());
            topReps.filterFunctions[this.id].call();
            topReps.onDataChange();
        });
    };
    topReps.addFilters = function () {
        for (var filter in topReps.dropDowns) {
            console.log(topReps.dropDowns[filter]);
            topReps.filterOnClick(topReps.dropDowns[filter]);
        }
    };

    topReps.clearActiveFilters = function(clear=false){
        for(var filter in topReps.activeFilters){
            topReps.activeFilters[filter] = [];
            if(clear) topReps[filter].filterAll();
        }
    };
    $('#clearFilters').click(function(e){
        //$('#filters').empty();
        let clear = true;
        topReps.clearActiveFilters(clear);
        topReps.onDataChange();
        topReps.cycleTeams();
    });

    
    topReps.cycleTeams = function () {
        let i = 0;
        let clear = true;
        var teams = topReps.TeamDim.group().all();
        var num_teams = topReps.TeamDim.group().all().length;

        topReps.timer = setInterval(teamSwitch, topReps.CYCLE_DURATION);
        function teamSwitch(){
            topReps.clearActiveFilters(clear);
            console.log(teams[i%num_teams].key);
            $('#selectedTeam').text(teams[i%num_teams].key);
            topReps.activeFilters["TeamDim"].push(teams[i%num_teams].key);
            topReps.filterFunctions["TeamDim"].call();
            topReps.onDataChange();
            i++;
        };
    };




}(window.topReps = window.topReps || {}));
/* global $, crossfilter, d3 */

(function (topReps) { //Top (x) axis is cpm, left (y) axis is users 
    'use strict';

    var svg = d3.select("#viz"); //VARIABLES 
    var margin = { top: 20, right: 40, bottom: 20, left: 60 };
    var w = $(document).width() - margin.left - margin.right,
        h = 700 - margin.top - margin.bottom;
    console.log("h", h);
    const padding_bottom = 25;

    var yScale = d3.scaleBand() //SCALES
        .range([padding_bottom, h]),
    xScale = d3.scaleLinear()
        .range([0, w]);

    var yAxis = d3.axisLeft(yScale), //DEFINE AND ADD AXIS 
        xAxis = d3.axisBottom(xScale);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h + margin.bottom) + ")")
        .append("g")
        .append("text")
        .attr('id', 'x-axis-label')
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
    svg.append("g")
        .attr("class", "y axis")
        .append("g")
        .append("text")
        .attr('id', 'y-axis-label')
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    topReps.updateBars = function (data) { //LET ALL THE STUFF BE RENDERED! VALHALLA!
        
        switch (topReps.data_group) {
            case "callsDim":
                var group = "UserName";
                var measure = "cpm";
                break;
            case "occsDim":
                var group = "UserName";
                var measure = "sum_order";
                break;
            case "quoteDim":
                var group = "UserName";
                var measure = "n_f3_records";
                break;
        };
        data = data.filter(function (d) {
            return (!d[measure]) ? null : (d[measure] > 0) ? d[measure] : null;
        }).sort(function (a, b) {
            return b[measure] - a[measure];
        });
        //console.log("from updateBars", data);
        
        //h = topReps.n_reps * 20 - margin.top - margin.bottom;
        console.log("h", h);
        console.log("n_reps ", topReps.n_reps);
        var barHeight = (h  / data.length) ;
        console.log("data length ", data.length);
        console.log("bar height", barHeight);
        yScale.domain(data.map(function (d) { return d[group]; }));
        xScale.domain([0, d3.max(data, function (d) { return d[measure]; })+margin.right]);

        svg.select('.x.axis')
            .transition().duration(topReps.TRANS_DURATION)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function () { return "rotate(-45)"; });
        var xLabel = svg.select('#x-axis-label')
            .text(measure); // this and yLabel is being rendered over TODO fix
        svg.select('.y.axis')
            .transition().duration(topReps.TRANS_DURATION)
            .call(yAxis)
            .selectAll("text")
            .attr("dy", "-.8em")
            .attr("dx", ".98em")
            .attr("transform", function () { return "rotate(-35)"; });
        var yLabel = svg.select('#y-axis-label');
        yLabel.text(group);

        //BARS 
        var bars = svg.selectAll(".bar")
            .data(data, function (d) {
                return d[group];
            });
        bars.enter()
            .append("rect")
            .attr("class", "bar")
        .merge(bars)
            .attr("x", 25)
            .attr("ry", 5)
            .transition().duration(topReps.TRANS_DURATION)
            .attr("width", function (d) {
                //console.log("rects ", d);
                return xScale(d[measure]);
            })
            .attr("y", function (d) { return yScale(d[group]) - margin.bottom / 2; })
            .attr("height", function () { return Math.abs(barHeight-10); });
        bars.exit().remove();

        //TEXT
        var texts = svg.selectAll(".text")
            .data(data, function (d) {
                return d[group];
            });
        texts.enter()
            .append("text")
            .attr("class", "text")
        .merge(texts)
            .attr("x", 35)
            .attr("dy", barHeight/2)
            .transition().duration(topReps.TRANS_DURATION)
            .attr("y", function (d) { return yScale(d[group]) - margin.bottom / 2; })
            .text(function (d) { return measure+": "+d[measure]; });
        texts.exit().remove();

        //wow! no text but measures AND reps are perfect 
        //var bars = svg.selectAll(".bar")
        //    .data(data, function (d) {
        //        return d[group];
        //    });
        //bars.enter()
        //    .append("rect")
        //    .attr("class", "bar")
        //.merge(bars)
        //    .attr("x", 25)
        //    .transition().duration(topReps.TRANS_DURATION)
        //    .attr("width", function (d) {
        //        //console.log("rects ", d);
        //        return xScale(d[measure]);
        //    })
        //    .attr("y", function (d) { return yScale(d[group]) - margin.bottom / 2; })
        //    .attr("height", function () { return barHeight; });
        //bars.exit().remove();

        //good between measures
        //var bars = svg.selectAll(".bar")
        //    .data(data, function (d) {
        //        //console.log((group + d[group] + measure + d[measure] + "barHeight" + barHeight).replace(" ", ""));
        //        return (group + d[group] + measure + d[measure] + "barHeight" + barHeight).replace(" ", "");
        //    });
        //console.log(bars);
        //var groups = bars
        //    .enter()
        //    .append("g")
        //    .attr("class", "barGroup");
        //console.log(groups);
        //var rects = d3.selectAll(".barGroup")
        //    .append("rect")
        //    .attr("class", "bar")
        //    .attr("x", 25)
        //    .transition().duration(topReps.TRANS_DURATION)
        //    .attr("width", function (d) {
        //        //console.log("rects ", d);
        //        return xScale(d[measure]);
        //    })
        //    .attr("y", function (d) { return yScale(d[group])-margin.bottom/2; })
        //    .attr("height", function () { return barHeight; });
        //console.log(rects);
        //var texts = d3.selectAll(".barGroup")
        //    .append("text")
        //    .attr("class", "barValues")
        //    .attr("x", 25)
        //    .transition().duration(topReps.TRANS_DURATION)
        //    .attr("y", function (d) { return yScale(d[group]) - margin.bottom / 2; })
        //    .attr("dy", 15)
        //    .text(function (d) { return measure + ": " + d[measure] });
        //console.log(texts);

        //bars.exit().remove();
        //groups.exit().remove();
        ////rects.exit().remove();
        ////texts.exit().remove();
        ////gs.exit().remove();
        //d3.selectAll(".bar").exit().remove();
        //d3.selectAll(".barGroup").exit().remove();
        //d3.selectAll(".barValues").exit().remove();
        //console.log("bars ", bars);
    };

}(window.topReps = window.topReps || {}));
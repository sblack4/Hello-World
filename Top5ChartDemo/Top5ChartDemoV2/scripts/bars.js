/* global $, crossfilter, d3 */

(function (topReps) { //Top (x) axis is cpm, left (y) axis is users 
    'use strict';
    var format = d3.format(".2f");
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
        .attr("transform", "translate(0," + (h + margin.bottom) + ")");
    svg.append("g")
        .attr("class", "y axis");

    topReps.updateBars = function (data) { //LET ALL THE STUFF BE RENDERED! VALHALLA!
        $("#xAxisLabel").text(topReps.measure);
        var measure = topReps.measure;
        var group = topReps.group;

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
        xScale.domain([0, topReps.xAxisMax+margin.right]);

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
            .attr("x", 15)
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
            .text(function (d) { return format(d[measure]); });
        texts.exit().remove();
    };

}(window.topReps = window.topReps || {}));
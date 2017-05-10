import * as d3 from 'd3';
import * as $ from 'jquery';
import { fileData } from './main';
import { topReps } from './core';
import { stringColorLegend } from './createLegend';


var format = d3.format(".2f");
var svg: any;
var margin = { top: 20, right: 40, bottom: 20, left: 60 };
var w = $(document).width() - margin.left - margin.right,
    h = 700 - margin.top - margin.bottom;
console.log("h", h);
const padding_bottom = 25;
var rank = "rank";
var yScale = d3.scaleBand() //SCALES
    .range([padding_bottom, h]),
    xScale = d3.scaleLinear()
        .range([0, w]);

var yAxis = d3.axisLeft(yScale) as any, //DEFINE AND ADD AXIS 
    xAxis = d3.axisBottom(xScale) as any;
var colorTeams = function (team) {
    switch (team) {
        case "Verizon":
            return "#FD0000";
        case "Adobe":
            return "#FD4900";
        case "Symantec":
            return "#FD7300";
        case "Google":
            return "#FD9500";
        case "VMware":
            return "#FDC800";
        case "Open Source":
            return "#FDF200";
        case "HP":
            return "#C2F300";
        case "Splunk":
            return "#49DA00";
        case "SAP":
            return "#00B14A";
        case "Salesforce":
            return "#009797";
        case "Intel":
            return "#057C9D";
        case "EMC":
            return "#1A34AA";
        case "IBM":
            return "#4710Ac";
        case "F5":
            return "#7F069F";
        case "Other":
            return "#CF0077";
        default:
            return "steelblue";
    }
};



var createBarsTemplate = function () {
    var htmlString = '    <div class="container"> \n <h3 class="text-muted" > Top Reps <i id= "selectedDim" style= "padding-left:40px;" > </i> <i id="selectedTeam" style="padding-left:40px;"></i> </h3> \n   </div>  \n <svg id="viz" > <div id="legend"></div> </svg> \n <div class="container xAxisContainer" > \n    <h3 id="xAxisLabel" > </h3> \n  </div>';
    $('body').prepend(htmlString);
    svg = d3.select("#viz");
    d3.select("#legend")
        .attr("id", "legend")
        .style("position", "relative")
        .style("height", 600)
        .style("transform", function () { return `translate(${2.7 * (w / 4) + margin.right}px,${h / 3}px)`; });
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h + margin.bottom) + ")");
    svg.append("g")
        .attr("class", "y axis");
    stringColorLegend("#legend", colorTeams, fileData.data, fileData.measure)
    $("#xAxisLabel").text(fileData.measure);
    d3.select('.container.xAxisContainer')
        .style("transform", function () { return `translate(0px,${(h - 50) / 2}px)`; });
};

let updateBars = function (data) { //LET ALL THE STUFF BE RENDERED! VALHALLA!
    var measure = fileData.measure;
    var group = fileData.group;

    data = data.filter(function (d) {
        return (!d[measure]) ? null : (d[measure] > 0) ? d[measure] : null;
    }).sort(function (a, b) {
        return b[measure] - a[measure];
    });
    //console.log("from updateBars", data);

    //h = topReps.n_reps * 20 - margin.top - margin.bottom;
    console.log("h", h);
    console.log("n_reps ", topReps.n_reps);
    var barHeight = (h / data.length);
    console.log("data length ", data.length);
    console.log("bar height", barHeight);
    yScale.domain(data.map(function (d) { return d[group]; }));
    xScale.domain([0, fileData.xAxisMax + margin.right]);

    svg.select('.x.axis')
        .transition().duration(topReps.TRANS_DURATION)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function () { return "rotate(-45)"; });
    svg.select('.y.axis')
        .transition().duration(topReps.TRANS_DURATION)
        .call(yAxis)
        .selectAll("text")
        .attr("dy", "-.8em")
        .attr("dx", ".98em")
        .attr("transform", function () { return "rotate(-35)"; });

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
        .attr("height", function () { return Math.abs(barHeight - 10); })
        .style("fill", function (d) { return colorTeams(d["TeamName"]); });
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
        .attr("dy", barHeight / 2)
        .transition().duration(topReps.TRANS_DURATION)
        .attr("y", function (d) { return yScale(d[group]) - margin.bottom / 2; })
        .text(function (d) { return format(d[measure]) + ", # " + d[rank]; });
    texts.exit().remove();
};

export { updateBars, createBarsTemplate };
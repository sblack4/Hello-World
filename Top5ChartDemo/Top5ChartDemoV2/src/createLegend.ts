// d3 legend, right now 1 method for the bars.ts
import * as d3 from 'd3';

var stringColorLegend = function (g: string, colorfunction: Function, data: any, measure:string):void {
    var container = d3.select(g).append("svg");
    container.style("height", 2*$("#viz").height()/3)
        .style("width", 1.3*$("#viz").width()/4);
    var keyValues: Array<[string, string, number]>;     // team, color, total measure
    keyValues = [];
    var categoryNest = d3.nest()
        .key(function (d) { return d["TeamName"]; }) //HARDCODED
        .entries(data);
    console.log(categoryNest);
    categoryNest.forEach(function (d) {
        let sum = d3.sum(d.values, function (r) { return r[measure]; });
        keyValues.push([d.key, colorfunction(d.key), sum]);
    });
    keyValues = keyValues.sort(function (a, b) {
        return b[2] - a[2];
    });
    var legendGroup = container.selectAll(".legendGroup")
        .data(keyValues)
        .enter()
        .append("g")
        .attr("transform", function (d, i) { return `translate(0,${i*18+10})`; })
        .attr("class", "legendGroup");
    legendGroup.append("rect")
        .attr("class", "bar")
        .attr("ry", 5)
        .style("width", $("body").width() / 4)
        .style("height", 16)
        .style("fill", function (d) { return d[1] });
    legendGroup.append("text")
        .attr("class", "text")
        .attr("dy", 14)
        .attr("dx", 2)
        //.style("fill", function (d) { return d[1]; })
        .text(function (d, i) { return "#"+(i+1)+" "+ d[0]+", "+Math.round(d[2]); });

};

export { stringColorLegend };
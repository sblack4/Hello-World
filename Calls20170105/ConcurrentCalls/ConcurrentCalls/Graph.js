"use strict";
const d3 = require('d3');
const $ = require('jquery');
function RunGraph(data) {
    console.debug("method RunGraph");
    let svg = d3.select("#viz"), h = $('#viz').height(), w = $('#viz').width(), margin = {
        top: 40,
        left: 60,
        bottom: 20,
        right: 40
    };
    let timeParse = d3.timeParse("%H:%M:%S.0000000");
    let durFormat = d3.format(".2");
    let durationFormat = (dur) => {
        return durFormat(dur / 60.0);
    };
    let minTime = d3.min(data, (d) => { return timeParse(d.Time_Stamp); }), maxTime = d3.max(data, (d) => { return timeParse(d.Time_Stamp_End); });
    console.debug("mintime ", minTime, " maxtime ", maxTime);
    let xScale = d3.scaleBand()
        .domain(data.map(function (d, i) { return `#${i}`; }))
        .range([margin.left, w - margin.right]), yScale = d3.scaleTime()
        .domain([d3.min(data, (d) => { return timeParse(d.Time_Stamp); }), d3.max(data, (d) => { return timeParse(d.Time_Stamp_End); })])
        .range([h - margin.bottom, margin.top]);
    let xAxis = d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter(function (d, i) { return i % 1000 == 0; }));
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${h - margin.bottom})`)
        .call(xAxis)
        .selectAll('text');
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(d3.axisLeft(yScale));
    svg.append("text")
        .attr("class", "yAxisLabel label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("x", -150)
        .attr("dy", ".5em")
        .attr("transform", "rotate(-90)")
        .text("Call Start Time (bottom of bar) to Call End Time (Top of Bar)");
    svg.append("text")
        .attr("class", "xAxisLabel label")
        .attr("text-anchor", "end")
        .attr("x", (w / 5) * 3)
        .attr("y", h - 6)
        .text("Number Call that Day");
    let bars = svg.selectAll(".calls")
        .data(data)
        .enter().append("rect")
        .attr("class", "call")
        .attr("transform", (d, i) => { return `translate(${xScale(`#${i}`)}, ${yScale(timeParse(d.Time_Stamp_End))})`; })
        .attr("height", (d) => { return yScale(timeParse(d.Time_Stamp)) - yScale(timeParse(d.Time_Stamp_End)); });
    let concurrentCalls = [];
    $("a.numCalls").click(function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        infoPopUp(concurrentCalls);
        d3.select('#popup').classed('hidden', false);
    });
    let timeFormat = d3.timeFormat("%I:%M:%S %p");
    let line = svg.append('path')
        .style("stroke-dasharray", ("3, 3"))
        .attr("id", "line")
        .attr("class", "line");
    function horizontalLine(yPos) {
        let currentTime = yScale.invert(yPos);
        line.attr("d", `M ${margin.left} ${yPos} l ${$('#viz').width()} 0 `);
        concurrentCalls = data.filter((d) => {
            return (timeParse(d.Time_Stamp) < currentTime && timeParse(d.Time_Stamp_End) > currentTime);
        });
        d3.select('a.numCalls').html(`${concurrentCalls.length} Concurrent Calls, at ${timeFormat(currentTime)}`);
    }
    let yPos = 0;
    let doClick = true;
    function toggleHorizontalLine(mousePos) {
        $("*").click(function (event) {
            d3.select('#popup').classed('hidden', true);
            if (doClick) {
                doClick = false;
            }
            else {
                doClick = true;
            }
        });
        yPos = (doClick) ? mousePos : yPos;
        horizontalLine(yPos);
    }
    $(document).mousemove(function (event) {
        toggleHorizontalLine(event.clientY);
    });
    $.each(data[0], function (i, val) {
        $('#headers').append(`<th>${i}</th>`);
    });
    function infoPopUp(calls) {
        let table = $('tbody');
        $.each(calls, function (key, value) {
            let row = table.append('<tr></tr>');
            $.each(value, function (i, val) {
                row.append(`<td>${val}</td>`);
            });
        });
    }
}
exports.RunGraph = RunGraph;
//# sourceMappingURL=Graph.js.map
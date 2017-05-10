import * as d3 from 'd3';
import { IDatum } from './IData';
import * as $ from 'jquery';

function RunGraph(data: Array<IDatum>) {

    console.debug("method RunGraph");
    let svg = d3.select("#viz")
        , h = $('#viz').height()
        , w = $('#viz').width()
        , margin = {
            top: 40,
            left: 60,
            bottom: 40,
            right: 40
        };

    let timeParse = d3.timeParse("%H:%M:%S.0000000");
    let durFormat = d3.format(".2");
    let durationFormat = (dur: number) => {
        return durFormat(dur / 60.0);
    };
    let minTime = d3.min(data, (d) => { return timeParse(d.Time_Stamp); }),
        maxTime = d3.max(data, (d) => { return timeParse(d.Time_Stamp_End); });
    console.debug("mintime ", minTime, " maxtime ", maxTime);

    // Scales: x= #Calls, y= CallTimes
    let xScale = d3.scaleBand()
            .domain(data.map(function (d: IDatum, i:number) { return `#${i}`; }))
            .range([margin.left, w - margin.right])
        , yScale = d3.scaleTime()
            .domain([d3.min(data, (d) => { return timeParse(d.Time_Stamp); }), d3.max(data, (d) => { return timeParse(d.Time_Stamp_End); })])
            .range([h - margin.bottom, margin.top]);

    // Axis, ugly and unnecessary 
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
        //.selectAll('text')
        //.attr("transform", "rotate(90)");   

    //Adding axis labels
    svg.append("text")
        .attr("class", "yAxisLabel label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("x", -150)
        .attr("dy", ".5em")
        .attr("transform", "rotate(-90)")
        .text(" Time of Call Start (bar bottom) to Call End (bar top)");
    svg.append("text")
        .attr("class", "xAxisLabel label")
        .attr("text-anchor", "end")
        .attr("x", (w/6)*4.3)
        .attr("y", h - 6)
        .text("Number Call that Day, Ordered by Time Started");

    let xAxisHeight = $('.xAxisLabel').height() + $('.x.axis').height();


    // bars or paths 
    let bars = svg.selectAll(".calls")
        .data(data)
        .enter().append("rect")
        .attr("class", "call")
        .attr("transform", (d, i) => { return `translate(${xScale(`#${i}`)}, ${yScale(timeParse(d.Time_Stamp_End))})` })
        .attr("height", (d) => { return yScale(timeParse(d.Time_Stamp)) - yScale(timeParse(d.Time_Stamp_End)); });


    // zoom behavior 
    //svg.call(d3.zoom().scaleExtent([1 / 2, 4]).on("zoom", zoomed));
    //function zoomed() {
    //    var trans = d3.event.transform;
    //    console.debug("trans >> ", trans);
    //    // okay - apply an x transformation to the page with the scale used to set the page with, then do with y
    //    bars.attr("transform", (d: IDatum) => {
    //        console.debug("trans zoom, d >> ", d);
    //        console.debug("xscale >>> ", xScale(`#${d.Call_ID - 19790099}`));
    //        return `translate(${trans.applyX(xScale(`#${d.Call_ID - 19790099}`))}, ${trans.applyY(yScale(timeParse(d.Time_Stamp_End)))})`
    //    });

    //};

    //horizontal line 
    //let inverseYFormat = d3.format("%a %b %d ");

    // on click of link show concurrentCall info
    let concurrentCalls: Array<IDatum> = [];
    $("a.numCalls").click(function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        infoPopUp(concurrentCalls);
        d3.select('#popup').classed('hidden', false);
    });


    //that line accross the screen with the number of concurrentCalls 
    let timeFormat = d3.timeFormat("%I:%M:%S %p");
    let line = svg.append('path')
        .style("stroke-dasharray", ("3, 3"))
        .attr("id", "line")
        .attr("class", "line");
    function horizontalLine(yPos: number) {
        let currentTime = yScale.invert(yPos);
        line.attr("d", `M ${margin.left} ${yPos} l ${$('#viz').width()} 0 `);
        concurrentCalls = data.filter((d: IDatum) => {
            return (timeParse(d.Time_Stamp) < currentTime && timeParse(d.Time_Stamp_End) > currentTime);
        });
        d3.select('a.numCalls').html(`${concurrentCalls.length} Concurrent Calls, at ${timeFormat(currentTime)}`);
    }
    let yPos = 0;
    let doClick = true;
    function toggleHorizontalLine(mousePos: number) {
        $("*").click(function (event) {
            d3.select('#popup').classed('hidden', true);
            if (doClick) {
                doClick = false;
            } else {
                doClick = true;
            }
        });
        yPos = (doClick) ? mousePos-xAxisHeight : yPos;
        horizontalLine(yPos);
    }
    $(document).mousemove(function (event) {
        toggleHorizontalLine(event.clientY);
    });


    // functions for table 
    $.each(data[0], function (i, val) {
        $('#headers').append(`<th>${i}</th>`);
    });
    function infoPopUp(calls: Array<IDatum>) {
        let table = $('tbody');
        $.each(calls, function (key, value) {
            let row = table.append('<tr></tr>');
            $.each(value, function (i, val) {
                row.append(`<td>${val}</td>`)
            });
        });
    }





}





export { RunGraph };
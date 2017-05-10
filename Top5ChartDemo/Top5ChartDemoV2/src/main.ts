/*  Imports the data file and routes the program
*/
import * as $ from 'jquery';
import * as d3 from 'd3';

import {topReps, makeFilterDimensions, cycleReps} from './core';

declare interface fileData {
    group: string;
    measure: string;
    reportType: number;
    data: any;      //Above fields are necessary, below are optional
    xAxisMax?: number;
    customer?: string;
}

function getFileData(data: any): fileData {
    let fileData = {} as fileData; //Instantiate interface 
    try {
        fileData.group = data.HeaderInfo[0].GroupingField;
        fileData.measure = data.HeaderInfo[0].CountingField;
        fileData.reportType = data.HeaderInfo[0].ReportType
        fileData.data = data.dt;
    } catch (error) {
        console.warn("Error getting necessary file metadata", error);
    }
    fileData.xAxisMax = (data.HeaderInfo[0].xAxisMax) ? data.HeaderInfo[0].xAxisMax : null;
    fileData.customer = (data.HeaderInfo[0].Customer) ? data.HeaderInfo[0].Customer : null;
    return fileData;
}
let fileData = {} as fileData; // This is Global 
function ready():void {
    d3.json("../data/calls.json", function (error: Error, data: any) {
        if (error) console.warn(error);
        fileData = getFileData(data);
        console.log(fileData.reportType);
        console.log(graphType.CyclingBars);
        initiateGraph(fileData.reportType);

    });
};

enum graphType {
    "ForceGraph",   
    "ForceWords",
    "WordBubbles",
    "PackedBubbles",
    "WordCloud",
    "Bars",         
    "CyclingBars"   //6
}

function initiateGraph(graph:number):void {
    switch (graph) { // calls the correct graph based on header
        case graphType.ForceGraph:
            console.log("Force Graph. ");
            //runForceGraph(data);
            break;
        case graphType.ForceWords:
            //runForceWords(data);
            break;
        case graphType.WordBubbles:
            //recency = false;
            //runWordBubbles(data);
            break;
        case graphType.PackedBubbles:
            //runPackedBubbles(data);
            break;
        case graphType.WordCloud: // Wait until I translate the package to v4
            alert("This graph is not yet implemented! ")
            //    runWordCloud(data);
            break;
        case graphType.Bars:
            //alert("This graph is not yet implemented! ")
            //recency = false;
            //runBars(data);
            break;
        case graphType.CyclingBars:
            try {
                makeFilterDimensions(fileData.data);
            } catch (error) {
                console.warn("Error making filter dimensions", error);
            }
            try {
                cycleReps();
            } catch (error) {
                console.warn("Error making initializing graph ", error);
            }
            break;
        default:
            d3.select("#loading").text("Error - invalid graph");
            return;
    }
};

ready();
export { fileData };
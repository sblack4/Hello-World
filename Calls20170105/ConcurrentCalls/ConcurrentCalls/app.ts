import * as d3 from 'd3';
import { IData, IDatum } from './IData'
import { RunGraph } from './Graph';

window.onload = () => {
    var el = document.getElementById('content');
    const dataPath: string = 'Calls20170105.csv';
    d3.csv(dataPath, function (error: Error, data: any) {
        if (error) {
            console.warn(error);
        } else {
            console.debug("main, data >>> ", data);
            RunGraph(data);
        }
    });
};
import { Injectable } from '@angular/core';
import geolib from 'geolib';
//import 'geolib/dist/geolib';

@Injectable()
export class ZonesProvider {
    
    nodeArray: any = [];
    constructor() {

    }
    runEval(points,distance, threshold){
        this.eval(points,distance, threshold);
        return {
            promise: new Promise((resolve) => {
                resolve("resolve");   
            }),
            zones: this.nodeArray
        };
    }
    eval(points,distance, threshold){  
        this.nodeArray = [];
        while(points.length > 1){
            var nodes = [];
            var newPoints = [];
            var change = false;
            nodes.push(points.shift());
            for(let i = 0; i < points.length; i++){
                if(geolib.getDistance(
                {latitude: nodes[0].lat, longitude: nodes[0].lng},
                {latitude: points[i].lat, longitude: points[i].lng}) < distance){
                    change = true;
                    nodes.push(points.splice(i,1));
                    newPoints.push(nodes[nodes.length-1]);
                }
            }
            while(change){
                change = false;
                var temp = [];
                for(let i = 0; i < newPoints.length; i++){
                    for(let b = 0; b < points.length; b++){
                        if(geolib.getDistance(
                        {latitude: newPoints[i][0].lat, longitude: newPoints[i][0].lng},
                        {latitude: points[b].lat, longitude: points[b].lng}) < distance){
                            change = true;
                            nodes.push(points.splice(b,1));
                            temp.push(nodes[nodes.length-1]);
                        }
                    }
                }
                if(change){
                    newPoints = temp;
                }
            }
            if(nodes.length >= threshold){
                this.nodeArray.push(this.findCenter(nodes));
            }
        }
    }
    findCenter(nodes){
        var lat = 0;
        var lng = 0;
        var dist = 0;
        for(let i = 0; i < nodes.length; i++){
            if(i == 0){
                lat += nodes[i].lat;
                lng += nodes[i].lng;
            }else{
                lat += nodes[i][0].lat;
                lng += nodes[i][0].lng;
            }
            if(i < nodes.length-1){
                var tempDist = geolib.getDistance(
                {latitude: nodes[0].lat, longitude: nodes[0].lng},
                {latitude: nodes[i+1][0].lat, longitude: nodes[i+1][0].lng})
                if(tempDist > dist){
                    dist = tempDist
                }
            }
        }
        lat = lat/nodes.length;
        lng = lng/nodes.length;
        return {
            lat: lat,
            lng: lng,
            dist: dist
        };
    }
}

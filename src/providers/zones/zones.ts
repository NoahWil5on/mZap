//vanilla ionic imports
import { Injectable } from '@angular/core';

//geographic distance calculator import
import geolib from 'geolib';

@Injectable()
export class ZonesProvider {
    
    nodeArray: any = [];
    points: any = [];
    constructor() {

    }
    //called to find clusters on map
    runEval(myPoints,distance, threshold){
        this.nodeArray = [];
        
        //makes copy of points as not to disturb their value
        this.points = myPoints.slice();
        this.eval(this.points,distance, threshold);
        
        //returns promise to be resolved along with the array of nodes
        //which describe where clusters are on the map
        return {
            promise: new Promise((resolve) => {
                resolve("resolve");
            }),
            zones: this.nodeArray
        };
    }
    //run actual calculations on cluster with points, search distance, and cluster amount threshold
    eval(points,distance, threshold){  
        this.nodeArray = [];
        
        //while there are still points to search for
        while(points.length > 1){
            var nodes = [];
            var newPoints = [];
            var change = false;
            nodes.push(points.shift());
            
            //look through all points and find distances
            for(let i = 0; i < points.length; i++){
                
                //if distance is below specified value add it to node array and new point array
                if(geolib.getDistance(
                {latitude: nodes[0].lat, longitude: nodes[0].lng},
                {latitude: points[i].lat, longitude: points[i].lng}) < distance){
                    change = true;
                    nodes.push(points.splice(i,1));
                    newPoints.push(nodes[nodes.length-1]);
                }
            }
            //while we are still finding new points
            while(change){
                change = false;
                var temp = [];
                
                //look through the new points
                for(let i = 0; i < newPoints.length; i++){
                    
                    //compare them to unmarked & unfound points
                    for(let b = 0; b < points.length; b++){
                        //if distance is below specified value add it to node array and new point array
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
            //if all the points we found are enough to be considered a cluster
            if(nodes.length >= threshold){
                //add the node
                this.nodeArray.push(this.findCenter(nodes));
            }
        }
    }
    //find the center of all the points in the cluster
    findCenter(nodes){
        var lat = 0;
        var lng = 0;
        //var dist = 0;
        
        //add up their x and y positions
        for(let i = 0; i < nodes.length; i++){
            if(i == 0){
                lat += nodes[i].lat;
                lng += nodes[i].lng;
            }else{
                lat += nodes[i][0].lat;
                lng += nodes[i][0].lng;
            }
            /*if(i < nodes.length-1){
                var tempDist = geolib.getDistance(
                {latitude: nodes[0].lat, longitude: nodes[0].lng},
                {latitude: nodes[i+1][0].lat, longitude: nodes[i+1][0].lng})
                if(tempDist > dist){
                    dist = tempDist
                }
            }*/
        }
        //and divide it by the number o points
        lat = lat/nodes.length;
        lng = lng/nodes.length;
        return {
            lat: lat,
            lng: lng,
           // dist: dist
        };
    }
}

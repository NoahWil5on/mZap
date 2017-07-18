import { Injectable } from '@angular/core';
//import { Geolib } from 'geolib/dist/geolib';
//import 'geolib/dist/geolib';

@Injectable()
export class ZonesProvider {

  constructor() {
      
  }
    runEval(points){
        return {
            promise: new Promise((resolve) => {
                resolve("resolve");   
            }),
            zones: points
        };
    }
}

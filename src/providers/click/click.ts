import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()
export class ClickProvider {

    constructor() {

    }
    click(place){
        var ref = firebase.database().ref('clicks');
        ref.once('value').then(snapshot => {
            if(snapshot.hasChild(place)){
                ref.child(place).once('value').then(snap => {
                    var num = Number(snap.val());
                    ref.child(place).set(num+1);
                })
            }else{
                ref.child(place).set(1);
            }
        })
    }
}

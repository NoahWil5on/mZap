import { Component, ViewChild } from '@angular/core';
import { MapPage } from '../../pages/map/map';
// import { Events, AlertController } from 'ionic-angular';

import { TranslatorProvider } from '../../providers/translator/translator';

import * as firebase from 'firebase';

@Component({
  selector: 'ferry-rating',
  templateUrl: 'ferry-rating.html'
})
export class FerryRatingComponent {
    @ViewChild('main') main;

    ship: string = 'ship1';
    timeFrame: string = 'week';

    rating: string = '--';

    constructor(public mapPage: MapPage, public translate: TranslatorProvider) {
        setTimeout(() => {
            this.main.nativeElement.style.transform = "translate(-50%,-50%)";
        }, 10);
    }
    checkRating(){
        var day = 1000 * 60 * 60 * 24;
        var filter = 100000000;

        switch(this.timeFrame){
            case 'week':
                filter = day * 7;
                break;
            case 'month':
                filter = day * 30;
                break;
            case 'year':
                filter = day * 365;
                break;
            default:
                return;
        }
        var self = this;
        firebase.database().ref(`shipScore/${this.ship}`).orderByChild('date').startAt(Date.now()-filter).once('value').then(snapshot => {
            var total = 0;
            var positive = 0;
            snapshot.forEach(item => {
                total++;
                if(item.val().onTime) positive++;
            });
            if(total > 0){
                self.rating = ((positive/total) * 100).toFixed(1);
            }else{
                self.rating = '--';
            }
        });
    }
    closeOut() {
        this.mapPage.ferryRatingShow = false;
    }

}

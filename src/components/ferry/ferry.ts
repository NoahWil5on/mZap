import { Component, ViewChild } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { Events, AlertController } from 'ionic-angular';

import * as firebase from 'firebase';

@Component({
    selector: 'ferry',
    templateUrl: 'ferry.html'
})
export class FerryComponent {
    @ViewChild('main') main;

    ship: any = "ship1";
    start: any = "faj";
    end: any = "cul";
    myTime: any = "";

    /*fajardo*/
    //18.334442978342842
    //-65.63146590936526

    /*veq*/
    //18.152701253218318
    //-65.44469833124026

    /*cul*/
    //18.30172709763306
    //-65.30488036258896

    constructor(public mapPage: MapPage, public event: Events, public alertCtrl: AlertController) {
        this.myTime = new Date().toLocaleTimeString();
        setTimeout(() => {
            this.main.nativeElement.style.transform = "translate(-50%,-50%)";
        }, 10);
    }
    doShipTutorial(){
        this.mapPage.shipTut = true;
    }
    markShip() {
        var self = this;

        var submit = this.alertCtrl.create({
            title: "Are you sure you want to submit this post?",
            buttons: [{
                text: 'Submit',
                handler: () => {
                    self.event.publish('markShip', {
                        ship: this.ship,
                        start: this.start,
                        end: this.end
                    });
                    self.closeOut();
                }
            },{
                text: 'Cancel'
            }]
        });

        if (this.start != this.end) {
            firebase.database().ref(`ships/${this.ship}`).limitToLast(1).once('value').then(snapshot => {
                if (!snapshot.val()) {
                    submit.present();
                    return;
                }
                var snap;
                snapshot.forEach(item => {
                    snap = item.val();
                });
                var difference = Date.now() - snap.date;

                var time = "";                
                var minutes = Math.floor((1000 * 60 * 90 - difference) / (60 * 1000));
                if (minutes === 0) {
                    minutes++;
                }         
                var hours = Math.floor(minutes/60);
                minutes %= 60;
                if(hours > 0){
                    time = `${hours} hour`
                    if(minutes > 0){
                        time += ` and ${minutes} minute(s)`;
                    }
                }else{
                    time = `${minutes} minute(s)`;
                }
                if (difference < 1000 * 60 * 90) {
                    var noReport = this.alertCtrl.create({
                        title: "Oops! You can't do that yet",
                        subTitle: `Someone recently made a positing about this ship, try again in ${time}`,
                        buttons: [{
                            text: 'OK',
                            handler: () => {
                                this.closeOut();
                            }
                        }]
                    });
                    noReport.present();
                    return;
                }
                submit.present();
            })
        }
    }
    closeOut() {
        this.mapPage.ferryShow = false;
    }
}
